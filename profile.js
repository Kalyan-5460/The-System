// Profile Management System
class ProfileManager {
  constructor() {
    this.profile = this.loadProfile();
    this.previousHunterRank = null;
    this.previousJob = null;
    this.effectQueue = [];
    this.isShowingEffect = false;
    this.initializeEventListeners();
  }

  loadProfile() {
    const saved = localStorage.getItem('soloProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
    
    // Default profile
    return {
      level: 0,
      job: 'No Class',
      title: 'Sung JinWoo',
      stats: {
        str: 0,
        int: 0,
        agi: 0,
        vit: 0
      },
      availablePoints: 0
    };
  }

  saveProfile() {
    localStorage.setItem('soloProfile', JSON.stringify(this.profile));
  }

  // Reset all profile data to initial state
  resetProfile() {
    this.profile = {
      level: 0,
      job: 'No Class',
      title: 'Sung JinWoo',
      stats: {
        str: 0,
        int: 0,
        agi: 0,
        vit: 0
      },
      availablePoints: 0
    };
    this.saveProfile();
    this.updateProfileDisplay();
  }

  getDescription() {
    if (this.profile.level < 10) {
      return 'Low human strength.';
    } else if (this.profile.level < 25) {
      return 'Developing potential.';
    } else if (this.profile.level < 50) {
      return 'Rising hunter strength.';
    } else if (this.profile.level < 75) {
      return 'Elite hunter potential.';
    } else if (this.profile.level < 100) {
      return 'Walking the path of a Monarch.';
    } else if (this.profile.level < 200) {
      return 'Transcendent — Shadow Monarch awakened.';
    } else if (this.profile.level < 300) {
      return 'Harbinger of Eternal Night — Kings of the underworld kneel—not in respect, but in terror.';
    } else if (this.profile.level < 400) {
      return 'Architect of Armageddon — You don\'t fight battles. You design them.';
    } else if (this.profile.level < 500) {
      return 'Eclipse Monarch — Your shadows blot out the sun.';
    } else if (this.profile.level < 600) {
      return 'Void Reaper — Dimensions fracture at your will.';
    } else if (this.profile.level < 700) {
      return 'Abyssal Conqueror — The underworld kneels before you.';
    } else if (this.profile.level < 800) {
      return 'Netherborne Sovereign — Death is but your plaything.';
    } else if (this.profile.level < 900) {
      return 'Oblivion Warden — You rewrite the laws of existence.';
    } else if (this.profile.level < 1000) {
      return 'Paradox Emperor — Time and space obey your commands.';
    } else {
      return 'The Absolute — You are the system itself.';
    }
  }

  getHunterRank() {
    if (this.profile.level < 10) {
      return 'E-Rank Hunter (Mortal)';
    } else if (this.profile.level < 25) {
      return 'D-Rank Hunter (Apprentice)';
    } else if (this.profile.level < 50) {
      return 'C-Rank Hunter (Skilled)';
    } else if (this.profile.level < 75) {
      return 'B-Rank Hunter (Elite)';
    } else if (this.profile.level < 100) {
      return 'A-Rank Hunter (Ace)';
    } else if (this.profile.level < 200) {
      return 'S-Rank Hunter (National-Level)';
    } else if (this.profile.level < 300) {
      return 'SS-Rank Hunter (Continental Threat)';
    } else if (this.profile.level < 400) {
      return 'SSS-Rank Hunter (Planetary Devastator)';
    } else if (this.profile.level < 500) {
      return 'Monarch Candidate (Transcendent)';
    } else if (this.profile.level < 600) {
      return 'Shadow Monarch (Reality Breaker)';
    } else if (this.profile.level < 700) {
      return 'Ruler of the Dead (Eclipse Sovereign)';
    } else if (this.profile.level < 800) {
      return 'Void Emperor (Dimensional Conqueror)';
    } else if (this.profile.level < 900) {
      return 'The Absolute (System Override)';
    } else if (this.profile.level < 1000) {
      return 'The Architect (Creator of Dungeons)';
    } else {
      return 'SYSTEM PRIME (Final Authority)';
    }
  }

  // Get rank class for CSS styling
  getRankClass() {
    if (this.profile.level < 10) {
      return 'hunter-rank-E';
    } else if (this.profile.level < 25) {
      return 'hunter-rank-D';
    } else if (this.profile.level < 50) {
      return 'hunter-rank-C';
    } else if (this.profile.level < 75) {
      return 'hunter-rank-B';
    } else if (this.profile.level < 100) {
      return 'hunter-rank-A';
    } else if (this.profile.level < 200) {
      return 'hunter-rank-S';
    } else if (this.profile.level < 300) {
      return 'hunter-rank-SS';
    } else if (this.profile.level < 400) {
      return 'hunter-rank-SSS';
    } else if (this.profile.level < 500) {
      return 'hunter-rank-Monarch';
    } else if (this.profile.level < 600) {
      return 'hunter-rank-Shadow';
    } else if (this.profile.level < 700) {
      return 'hunter-rank-Ruler';
    } else if (this.profile.level < 800) {
      return 'hunter-rank-Void';
    } else if (this.profile.level < 900) {
      return 'hunter-rank-Absolute';
    } else if (this.profile.level < 1000) {
      return 'hunter-rank-Architect';
    } else {
      return 'hunter-rank-System';
    }
  }

  // Get rank color for effects
  getRankColor() {
    if (this.profile.level < 10) {
      return '#cccccc';
    } else if (this.profile.level < 25) {
      return '#ffd700';
    } else if (this.profile.level < 50) {
      return '#28a745';
    } else if (this.profile.level < 75) {
      return '#17a2b8';
    } else if (this.profile.level < 100) {
      return '#dc3545';
    } else if (this.profile.level < 200) {
      return '#6f42c1';
    } else if (this.profile.level < 300) {
      return '#fd7e14';
    } else if (this.profile.level < 400) {
      return '#e83e8c';
    } else if (this.profile.level < 500) {
      return '#20c997';
    } else if (this.profile.level < 600) {
      return '#3399ff';
    } else if (this.profile.level < 700) {
      return '#8b0000';
    } else if (this.profile.level < 800) {
      return '#4b0082';
    } else if (this.profile.level < 900) {
      return '#ffffff';
    } else if (this.profile.level < 1000) {
      return '#ffd700';
    } else {
      return '#00ff00';
    }
  }

  getTotalSkillPoints() {
    return this.profile.stats.str + this.profile.stats.int + this.profile.stats.agi + this.profile.stats.vit;
  }

  getJobBySkillPoints() {
    const totalSkillPoints = this.getTotalSkillPoints();
    
    if (totalSkillPoints < 10) {
      return 'No Class';
    } else if (totalSkillPoints < 30) {
      return 'Player (System User)';
    } else if (totalSkillPoints < 50) {
      return 'Ruler of Death';
    } else if (totalSkillPoints < 100) {
      return 'King of the Dead';
    } else if (totalSkillPoints < 200) {
      return 'Shadow Monarch';
    } else {
      return 'System Breaker';
    }
  }

  // Queue system for effects
  queueEffect(effectType, data = {}) {
    this.effectQueue.push({ type: effectType, data });
    if (!this.isShowingEffect) {
      this.processEffectQueue();
    }
  }

  async processEffectQueue() {
    if (this.effectQueue.length === 0) {
      this.isShowingEffect = false;
      return;
    }

    this.isShowingEffect = true;
    const effect = this.effectQueue.shift();

    switch (effect.type) {
      case 'levelUp':
        if (navigator.vibrate) navigator.vibrate([100]);
        await this.playLevelUpEffect();
        break;
      case 'hunterRankUp':
        if (navigator.vibrate) navigator.vibrate([200, 50, 200]); // strong vibe for rank up
        await this.playHunterRankUpEffect(effect.data.newRank, effect.data.color);
        break;
      case 'jobPromotion':
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // light double pulse
        await this.playJobPromotionEffect(effect.data.newJob);
        break;
      case 'hunterDemotion':
        await this.playHunterDemotionEffect(effect.data.oldRank);
        break;
      case 'jobDemotion':
        await this.playJobDemotionEffect(effect.data.oldJob);
        break;
      case 'penalty':
        await this.playPenaltyEffect();
        break;
      case 'countdownComplete':
        await this.playCountdownCompleteEffect();
        break;
    }

    // Wait a bit before processing next effect
    setTimeout(() => {
      this.processEffectQueue();
    }, 500);
  }

  levelUp() {
    const oldHunterRank = this.getHunterRank();
    const oldRankClass = this.getRankClass();
    
    this.profile.level++;
    this.profile.availablePoints++;
    
    const newHunterRank = this.getHunterRank();
    const newRankClass = this.getRankClass();
    const rankColor = this.getRankColor();
    
    // Queue level up effect first
    this.queueEffect('levelUp');
    
    // Check for hunter rank change (only if rank class changes, not just text)
    if (oldRankClass !== newRankClass) {
      this.queueEffect('hunterRankUp', { newRank: newHunterRank, color: rankColor });
    }
    
    this.saveProfile();
    this.updateProfileDisplay();
  }

  levelDown() {
    if (this.profile.level > 0) {
      const oldHunterRank = this.getHunterRank();
      const oldRankClass = this.getRankClass();
      
      this.profile.level--;
      
      const newHunterRank = this.getHunterRank();
      const newRankClass = this.getRankClass();
      
      // Check for hunter rank demotion (only if rank class changes)
      if (oldRankClass !== newRankClass) {
        this.queueEffect('hunterDemotion', { oldRank: oldHunterRank });
      }
      
      this.saveProfile();
      this.updateProfileDisplay();
    }
  }

  assignStatPoint(stat) {
    if (this.profile.availablePoints > 0) {
      const oldJob = this.getJobBySkillPoints();
      
      this.profile.stats[stat]++;
      this.profile.availablePoints--;
      
      const newJob = this.getJobBySkillPoints();
      
      // Check for job promotion
      if (oldJob !== newJob) {
        this.profile.job = newJob;
        this.queueEffect('jobPromotion', { newJob });
      }
      
      this.saveProfile();
      this.updateProfileDisplay();
      
      // Add visual feedback
      this.showStatUpdateEffect(stat);
    }
  }

  reduceStatPoint() {
    const stats = ['str', 'int', 'agi', 'vit'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    
    if (this.profile.stats[randomStat] > 0) {
      const oldJob = this.getJobBySkillPoints();
      
      this.profile.stats[randomStat]--;
      
      const newJob = this.getJobBySkillPoints();
      
      // Check for job demotion
      if (oldJob !== newJob) {
        this.profile.job = newJob;
        this.queueEffect('jobDemotion', { oldJob });
      }
      
      this.saveProfile();
      this.updateProfileDisplay();
    }
  }

  // Add bonus point for countdown completion
  addCountdownBonus() {
    this.profile.availablePoints++;
    this.queueEffect('countdownComplete');
    this.saveProfile();
    this.updateProfileDisplay();
  }

  showStatUpdateEffect(stat) {
    const statValue = document.getElementById(`${stat}Value`);
    if (statValue) {
      statValue.style.transform = 'scale(1.2)';
      statValue.style.textShadow = '0 0 20px #28a745';
      setTimeout(() => {
        statValue.style.transform = 'scale(1)';
        statValue.style.textShadow = '0 0 10px #fff';
      }, 300);
    }
  }

  updateJob(newJob) {
    this.profile.job = newJob;
    this.saveProfile();
  }

  updateTitle(newTitle) {
    this.profile.title = newTitle;
    this.saveProfile(); // This will save the updated profile to localStorage
    this.updateProfileDisplay(); // This will update the UI
  }

  updateProfileDisplay() {
    // Auto-assign job based on skill points
    this.profile.job = this.getJobBySkillPoints();
    
    document.getElementById('profileLevel').textContent = this.profile.level;
    document.getElementById('playerJob').value = this.profile.job;
    document.getElementById('playerTitle').value = this.profile.title;
    document.getElementById('profileDescription').textContent = this.getDescription();
    
    // Update hunter rank display with proper styling
    const hunterRankDisplay = document.getElementById('hunterRankDisplay');
    hunterRankDisplay.textContent = this.getHunterRank();
    
    // Remove all existing rank classes
    hunterRankDisplay.className = 'hunter-rank-display';
    // Add the current rank class
    hunterRankDisplay.classList.add(this.getRankClass());
    
    // Update stats
    document.getElementById('strValue').textContent = this.profile.stats.str;
    document.getElementById('intValue').textContent = this.profile.stats.int;
    document.getElementById('agiValue').textContent = this.profile.stats.agi;
    document.getElementById('vitValue').textContent = this.profile.stats.vit;
    
    // Update available points
    document.getElementById('pointsCount').textContent = this.profile.availablePoints;
    
    // Enable/disable stat buttons
    const hasPoints = this.profile.availablePoints > 0;
    document.getElementById('strBtn').disabled = !hasPoints;
    document.getElementById('intBtn').disabled = !hasPoints;
    document.getElementById('agiBtn').disabled = !hasPoints;
    document.getElementById('vitBtn').disabled = !hasPoints;
  }

  async playLevelUpEffect() {
    return new Promise((resolve) => {
      // Initialize tsParticles with Solo Leveling theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 150,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#3399ff", "#00ccff", "#ffffff", "#ffd700"]
          },
          shape: {
            type: ["circle", "triangle", "polygon"],
            polygon: {
              nb_sides: 6
            }
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 8,
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Level Up banner
      const banner = document.getElementById("levelupBanner");
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playHunterRankUpEffect(newRank, color) {
    return new Promise((resolve) => {
      // Initialize tsParticles with hunter rank theme using the rank color
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 200,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: [color, "#ffffff", "#ffeb3b"]
          },
          shape: {
            type: ["circle", "star", "polygon"],
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.9,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.2,
              sync: false
            }
          },
          size: {
            value: 10,
            random: true,
            anim: {
              enable: true,
              speed: 5,
              size_min: 0.5,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 8,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Hunter Rank Up banner with dynamic color
      const banner = document.getElementById("hunterRankBanner");
      const subtitle = document.getElementById("hunterRankSubtitle");
      const slashEffect = banner.querySelector('.hunter-slash-effect');
      const rankText = banner.querySelector('.hunter-rank-text');
      
      subtitle.textContent = newRank;
      
      // Update colors dynamically
      slashEffect.style.background = `linear-gradient(45deg, transparent 40%, ${color} 50%, transparent 60%)`;
      rankText.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}, 0 0 80px ${color}`;
      subtitle.style.color = color;
      subtitle.style.textShadow = `0 0 10px ${color}`;
      
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playJobPromotionEffect(newJob) {
    return new Promise((resolve) => {
      // Initialize tsParticles with job promotion theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 150,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#9c27b0", "#e91e63", "#ffffff", "#673ab7"]
          },
          shape: {
            type: ["circle", "triangle", "edge"],
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 8,
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 7,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Job Promotion banner
      const banner = document.getElementById("jobPromotionBanner");
      const subtitle = document.getElementById("jobPromotionSubtitle");
      subtitle.textContent = newJob;
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playHunterDemotionEffect(oldRank) {
    return new Promise((resolve) => {
      // Initialize tsParticles with demotion theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#424242", "#757575", "#9e9e9e"]
          },
          shape: {
            type: ["circle", "triangle"],
          },
          opacity: {
            value: 0.6,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 6,
            random: true,
            anim: {
              enable: true,
              speed: 3,
              size_min: 0.2,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 4,
            direction: "bottom",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Hunter Demotion banner
      const banner = document.getElementById("hunterDemotionBanner");
      const subtitle = document.getElementById("hunterDemotionSubtitle");
      subtitle.textContent = `Lost: ${oldRank}`;
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playJobDemotionEffect(oldJob) {
    return new Promise((resolve) => {
      // Initialize tsParticles with job demotion theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#424242", "#757575", "#9e9e9e"]
          },
          shape: {
            type: ["circle", "triangle"],
          },
          opacity: {
            value: 0.6,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 6,
            random: true,
            anim: {
              enable: true,
              speed: 3,
              size_min: 0.2,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 4,
            direction: "bottom",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Job Demotion banner
      const banner = document.getElementById("jobDemotionBanner");
      const subtitle = document.getElementById("jobDemotionSubtitle");
      subtitle.textContent = `Lost: ${oldJob}`;
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playPenaltyEffect() {
    return new Promise((resolve) => {
      // Initialize tsParticles with penalty theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#dc3545", "#ff6b35", "#ffffff", "#ff0000"]
          },
          shape: {
            type: ["circle", "triangle"],
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 6,
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 8,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Penalty banner
      const banner = document.getElementById("penaltyBanner");
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  async playCountdownCompleteEffect() {
    return new Promise((resolve) => {
      // Initialize tsParticles with countdown complete theme
      tsParticles.load("tsparticles", {
        fullScreen: {
          enable: true,
          zIndex: 9999
        },
        particles: {
          number: { 
            value: 120,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#ff9500", "#ffad33", "#ffffff", "#ffd700"]
          },
          shape: {
            type: ["circle", "star"],
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 7,
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: true
      });

      // Show Countdown Complete banner
      const banner = document.getElementById("countdownCompleteBanner");
      banner.style.display = "flex";

      // Hide everything after animation
      setTimeout(() => {
        banner.style.display = "none";
        if (tsParticles.domItem(0)) {
          tsParticles.domItem(0).destroy();
        }
        resolve();
      }, 3500);
    });
  }

  initializeEventListeners() {
    // Profile icon click
    document.getElementById('profileIcon').addEventListener('click', () => {
      this.showProfileModal();
    });

    // Close profile modal
    document.getElementById('closeProfileBtn').addEventListener('click', () => {
      this.hideProfileModal();
    });

    // Profile modal outside click
    document.getElementById('profileModal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('profileModal')) {
        this.hideProfileModal();
      }
    });

    // Title input changes (job is now readonly)
    document.getElementById('playerTitle').addEventListener('change', (e) => {
      this.updateTitle(e.target.value);
    });

    // Stat button clicks
    document.getElementById('strBtn').addEventListener('click', () => {
      this.assignStatPoint('str');
    });

    document.getElementById('intBtn').addEventListener('click', () => {
      this.assignStatPoint('int');
    });

    document.getElementById('agiBtn').addEventListener('click', () => {
      this.assignStatPoint('agi');
    });

    document.getElementById('vitBtn').addEventListener('click', () => {
      this.assignStatPoint('vit');
    });
  }

  showProfileModal() {
    this.updateProfileDisplay();
    document.getElementById('profileModal').style.display = 'flex';
  }

  hideProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
  }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.profileManager = new ProfileManager();
});

const titleInput = document.getElementById('playerTitle');
const editTitleModal = document.getElementById('editTitleModal');
const editTitleInput = document.getElementById('editTitleInput');
const saveTitleBtn = document.getElementById('saveTitleBtn');
const cancelTitleBtn = document.getElementById('cancelTitleBtn');

let titleLongPressTimer = null;

// Long press detection
titleInput.addEventListener('mousedown', () => {
  titleLongPressTimer = setTimeout(() => {
    openEditTitleModal();
  }, 600);
});
titleInput.addEventListener('mouseup', () => clearTimeout(titleLongPressTimer));
titleInput.addEventListener('mouseleave', () => clearTimeout(titleLongPressTimer));

titleInput.addEventListener('touchstart', () => {
  titleLongPressTimer = setTimeout(() => {
    openEditTitleModal();
  }, 600);
});
titleInput.addEventListener('touchend', () => clearTimeout(titleLongPressTimer));
titleInput.addEventListener('touchcancel', () => clearTimeout(titleLongPressTimer));

// Open modal
function openEditTitleModal() {
  editTitleInput.value = titleInput.value || "Sung JinWoo";
  editTitleModal.style.display = 'flex';
  editTitleInput.focus();
}

// Save new title
saveTitleBtn.addEventListener('click', () => {
  const newTitle = editTitleInput.value.trim();
  if (newTitle) {
    titleInput.value = newTitle;
    localStorage.setItem('hunterTitle', newTitle);
    // Update the profile manager's title
    if (window.profileManager) {
      window.profileManager.updateTitle(newTitle);
    }
  }
  editTitleModal.style.display = 'none';
});

// Cancel edit
cancelTitleBtn.addEventListener('click', () => {
  editTitleModal.style.display = 'none';
});

// Optional: load saved title on page load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('hunterTitle');
  if (saved) {
    titleInput.value = saved;
    // Also update the profile manager if it exists
    if (window.profileManager) {
      window.profileManager.updateTitle(saved);
    }
  }
});