const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const particleCount = 10000;
const particles = [];
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function Particle() {
  this.x = Math.random() * width;
  this.y = Math.random() * height;
  this.size = Math.random() * 5 + 1;
  this.speed = Math.random() * 2 + 1;
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.direction = Math.random() * Math.PI * 2;
}

Particle.prototype.update = function() {
  this.x += Math.cos(this.direction) * this.speed;
  this.y += Math.sin(this.direction) * this.speed;

  if (this.x < 0 || this.x > width || this.y< 0 || this.y > height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }
};

Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
};

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particleCount; i++) {
    particles[i].update();
    particles[i].draw();
  }

  requestAnimationFrame(animate);
}

animate();

// Add user input handling here