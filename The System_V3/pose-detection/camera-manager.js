class CameraManager {
    constructor() {
        this.video = document.getElementById('cameraFeed');
        this.canvas = document.getElementById('poseCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
    }

    async initialize() {
        try {
            // More specific constraints to prioritize the user-facing (front) camera on mobile
            const constraints = {
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user' 
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            this.video.srcObject = this.stream;
            
            // Flip the video horizontally for a mirror effect, which feels more natural.
            this.video.style.transform = 'scaleX(-1)';
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    // Also flip the canvas context to match the video feed
                    this.ctx.translate(this.canvas.width, 0);
                    this.ctx.scale(-1, 1);
                    resolve(true);
                };
            });
            
        } catch (error) {
            console.error('Camera initialization failed with specific constraints:', error);
             // Fallback for devices that might not support 'user' facingMode well
            console.log('Trying fallback camera constraints...');
            try {
                 const fallbackConstraints = { video: true, audio: false };
                 this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                 this.video.srcObject = this.stream;
                 return new Promise((resolve) => {
                    this.video.onloadedmetadata = () => {
                        this.canvas.width = this.video.videoWidth;
                        this.canvas.height = this.video.videoHeight;
                        resolve(true);
                    };
                });
            } catch (fallbackError) {
                console.error('Fallback camera initialization also failed:', fallbackError);
                 return false;
            }
        }
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        // Reset the video transform and canvas context when the camera is stopped
        this.video.style.transform = 'scaleX(1)';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset canvas transform
    }
}

window.cameraManager = new CameraManager();

