import Sketch from "sketch-js";
import Options from "./gameOptions.js";
import Stats from "./gameStats.js";
import Utils from "./utils.js";

export default {
    // particles/canvas effects
    setupParticles() {
        let particleImage = new Image();
        particleImage.src = '/static/cracker-small.png';

        class CurrencyParticle {
            constructor(x, y) {
                this.init(x, y);
            };
            init(x = 0.0, y = 0.0) {
                this.alive = true;
                this.life = 1;

                this.x = x;
                this.y = y;

                this.wander = random(0.5, 2.0);
                this.drag = random(0.9, 0.99);

                this.vx = random(-5, 5);
                this.vy = random(-5, -2);
            };
            move() {
                if (this.alive) {
                    this.x += this.vx;
                    this.y += this.vy;

                    this.vx *= this.drag;
                    this.vy += 0.5;

                    this.life *= 0.98;
                    this.alive = this.life > 0.05;
                }
            };
            draw(ctx) {
                if (this.alive) {
                    ctx.drawImage(particleImage, this.x, this.y, 40, 40);
                }
            };
        }

        class NumberParticle {
            constructor(x, y) {
                this.init(x, y);
            };
            init(x = 0.0, y = 0.0, clickPower = 1) {
                this.alive = true;
                this.life = 1;

                this.x = x + random(-10.0, 10.0);
                this.y = y;

                this.clickPower = clickPower;
            };
            move() {
                if (this.alive) {
                    this.y -= 0.75;
                    this.life -= 0.015;
                    this.alive = this.life > 0.05;
                }
            };
            draw(ctx) {
                if (this.alive) {
                    ctx.font = "bold 22px Helvetica Neue";
                    ctx.fillStyle = "rgba(0, 0, 0, " + this.life + ")";
                    ctx.fillText("+" + this.clickPower, this.x, this.y);
                }
            };
        }

        let currencyParticles = [];
        let currencyPool = [];
        let numberParticles = [];
        let numberPool = [];
        let maxParticles = 33;

        Sketch.create({
            container: document.getElementById('currency'),
            fullscreen: false,
            width: 350,
            height: 350,
            click() {
                if (Options.state.particles) {
                    this.spawnCurrencyParticle(this.mouse.x, this.mouse.y);
                    this.spawnNumberParticle(this.mouse.x, this.mouse.y);
                }
            },

            spawnCurrencyParticle(x, y) {
                if (currencyParticles.length >= maxParticles) {
                    currencyPool.push(currencyParticles.shift());
                }

                let particle = new CurrencyParticle();
                particle.init(x, y);
                currencyParticles.push(particle);
            },

            spawnNumberParticle(x, y) {
                if (numberParticles.length >= maxParticles) {
                    numberPool.push(numberParticles.shift());
                }

                let particle = new NumberParticle();
                let clickPower = Utils.round(Stats.state.clickPower);
                particle.init(x, y, clickPower);
                numberParticles.push(particle);
            },

            update() {
                let i, particle;
                for (i = currencyParticles.length - 1; i >= 0; i--) {
                    currencyParticles[i].move();
                }
                for (i = numberParticles.length - 1; i >= 0; i--) {
                    numberParticles[i].move();
                }
            },

            draw() {
                for (let i = currencyParticles.length - 1; i >= 0; i--) {
                    currencyParticles[i].draw(this);
                }
                for (let i = numberParticles.length - 1; i >= 0; i--) {
                    numberParticles[i].draw(this);
                }
            }
        });
    },
};
