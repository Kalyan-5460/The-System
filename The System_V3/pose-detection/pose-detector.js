// pose-detection/pose-detector.js

class PoseDetector {
    constructor() {
        this.pose = null;
        this.camera = null;
        this.isDetecting = false;
        this.exerciseType = null;

        // Counters
        this.counter = 0; // For floor pushups
        this.stage = null;
        this.leftCounter = 0; // For arm exercises
        this.rightCounter = 0;
        this.leftStage = null;
        this.rightStage = null;
    }

    async initialize() {
        this.pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.pose.onResults((results) => this.onResults(results));

        // Use the MediaPipe Camera utility
        this.camera = new Camera(cameraManager.video, {
            onFrame: async () => {
                if (this.isDetecting) {
                    await this.pose.send({ image: cameraManager.video });
                }
            },
            width: 640,
            height: 480
        });
    }

    async startDetection(exerciseType) {
        if (!this.pose) {
            await this.initialize();
        }
        await this.camera.start();

        this.isDetecting = true;
        this.exerciseType = exerciseType;

        // Reset counters
        this.counter = 0;
        this.stage = null;
        this.leftCounter = 0;
        this.rightCounter = 0;
        this.leftStage = null;
        this.rightStage = null;
        
        console.log(`${this.exerciseType} detection started`);
    }

    stopDetection() {
        this.isDetecting = false;
        if (this.camera) {
            // this.camera.stop(); // cameraManager.stop() is called in script.js, so this is redundant
        }
        console.log('Detection stopped');
        
        // Return the final counts for saving
        if (this.exerciseType === 'pushups') {
            return { total: this.counter };
        } else if (this.exerciseType === 'arms') {
            return { total: this.leftCounter + this.rightCounter };
        }
        return { total: 0 };
    }

    onResults(results) {
        if (!this.isDetecting || !results.poseLandmarks) return;

        const ctx = cameraManager.ctx;
        ctx.save();
        ctx.clearRect(0, 0, cameraManager.canvas.width, cameraManager.canvas.height);
        ctx.drawImage(results.image, 0, 0, cameraManager.canvas.width, cameraManager.canvas.height);

        this.drawLandmarks(results.poseLandmarks);

        if (this.exerciseType === 'pushups') {
            this.detectPushups(results.poseLandmarks);
        } else if (this.exerciseType === 'arms') {
            this.detectArmExercises(results.poseLandmarks);
        }
        ctx.restore();
    }
    
    drawLandmarks(landmarks) {
        const ctx = cameraManager.ctx;
        drawConnectors(ctx, landmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(ctx, landmarks, { color: '#FF0000', radius: 6 });
    }

    calculateAngle(a, b, c) {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) {
            angle = 360 - angle;
        }
        return angle;
    }
    
    playBeep(frequency = 800) {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        } catch (error) {
            // Audio not supported
        }
    }

    // --- Pushup-specific logic ---
    detectPushups(landmarks) {
        const leftShoulder = landmarks[11];
        const leftElbow = landmarks[13];
        const leftWrist = landmarks[15];
        const rightShoulder = landmarks[12];
        const rightElbow = landmarks[14];
        const rightWrist = landmarks[16];

        if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist || leftShoulder.visibility < 0.5 || rightShoulder.visibility < 0.5) {
            this.drawPushupStatus(null, "No pose detected");
            return;
        }

        const leftAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
        const rightAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
        const avgAngle = (leftAngle + rightAngle) / 2;

        if (avgAngle > 160) this.stage = "up";
        if (avgAngle < 90 && this.stage === "up") {
            this.stage = "down";
            this.counter++;
            this.playBeep();
        }
        this.drawPushupStatus(avgAngle);
    }
    
    drawPushupStatus(angle, statusText = null) {
        const ctx = cameraManager.ctx;
        const canvas = cameraManager.canvas;
        
        ctx.save();
        // Flip the context back to normal before drawing text
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 24px Orbitron';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        
        if(statusText) {
            ctx.fillText(statusText, 20, canvas.height - 20);
        } else {
             ctx.fillText(`COUNT: ${this.counter}`, 20, canvas.height - 60);
             ctx.fillText(`ANGLE: ${Math.round(angle)}°`, 20, canvas.height - 20);
        }
       
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // --- Arm exercise-specific logic ---
    detectArmExercises(landmarks) {
        const leftShoulder = landmarks[11];
        const leftElbow = landmarks[13];
        const leftWrist = landmarks[15];
        const rightShoulder = landmarks[12];
        const rightElbow = landmarks[14];
        const rightWrist = landmarks[16];

        if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist || leftShoulder.visibility < 0.5 || rightShoulder.visibility < 0.5) {
            this.drawArmStatus(null, null, "No pose detected");
            return;
        }
        
        const leftAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
        const rightAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
        
        // Left arm logic
        if (leftAngle > 160) this.leftStage = "up";
        if (leftAngle < 90 && this.leftStage === "up") {
            this.leftStage = "down";
            this.leftCounter++;
            this.playBeep(1000);
        }
        
        // Right arm logic
        if (rightAngle > 160) this.rightStage = "up";
        if (rightAngle < 90 && this.rightStage === "up") {
            this.rightStage = "down";
            this.rightCounter++;
            this.playBeep(1200);
        }
        
        this.drawArmStatus(leftAngle, rightAngle);
    }

    drawArmStatus(leftAngle, rightAngle, statusText = null) {
        const ctx = cameraManager.ctx;
        const canvas = cameraManager.canvas;
        const totalCount = this.leftCounter + this.rightCounter;

        ctx.save();
        // Flip the context back to normal before drawing text
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        
        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 20px Orbitron';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        
        if(statusText) {
            ctx.fillText(statusText, 20, canvas.height - 20);
        } else {
            ctx.fillText(`LEFT: ${this.leftCounter} (${Math.round(leftAngle)}°)`, 20, canvas.height - 50);
            ctx.fillText(`RIGHT: ${this.rightCounter} (${Math.round(rightAngle)}°)`, 20, canvas.height - 20);
            
            ctx.font = 'bold 24px Orbitron';
            ctx.textAlign = 'right';
            ctx.fillText(`TOTAL: ${totalCount}`, canvas.width - 20, canvas.height - 20);
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// Instantiate the single, unified detector
window.poseDetector = new PoseDetector();

