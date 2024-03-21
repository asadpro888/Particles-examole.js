

class Particle {
  constructor(effect){
    this.effect = effect;
    this.radius = Math.floor(Math.random() * 10 + 1);
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height- this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.pushX  = 0;
    this.pushY  = 0;
    this.friction = 0.4;
    this.image = document.getElementById('stars_sprite');
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.sizeModifier = Math.random() + 0.2;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
  }
  draw(context){
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - this.halfWidth, this.y - this.halfHeight, this.width, this.height);
  }
  update(){
    if (this.effect.mouse.pressed){
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = (this.effect.mouse.radius / distance);
      if(distance < this.effect.mouse.radius){
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }
    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;

    if (this.x < this.radius){
      this.x = this.radius;
      this.vx *= -1;
    }else if (this.x > this.effect.width - this.radius){
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if (this.y < this.radius){
      this.y = this.radius;
      this.vy *= -1;
    }else if (this.y > this.effect.height - this.radius){
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
    
  }
  reset(){
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height- this.radius * 2);
  }
}

class Effect {
    constructor(canvas, context){
      this.canvas = canvas;
      this.context = context;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.particles = [];
      this.numberOfParticles = 300;
      this.createPrticles();

      this.mouse = {
        x: 0,
        y: 0,
        pressed: false,
        radius: 500
      }   

      window.addEventListener('resize', e =>{
        this.resizeBy(e.target.window.innerWidth, e.target.window.innerHeight);
      });
      window.addEventListener('mousemove', e => {
       if(this.mouse.pressed){
          this.mouse.x = e.x;
          this.mouse.y = e.y;
          
       }

      });
      window.addEventListener('mousedown', e => {
        this.mouse.pressed = true;
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
      window.addEventListener('mouseup', e => {
        this.mouse.pressed = false;
      });
    }
    createPrticles(){
      for(let i = 0; i < this.numberOfParticles; i++){
        this.particles.push(new Particle(this));
      }
    }
    handlePaticles(context){
      this.connectParticles(context);
      this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
      });
      
    }
    connectParticles(context){
      const maxDistance = 80;
      for (let a = 0; a < this.particles.length; a++){
        for (let b = a; b < this.particles.length; b++){
          const dx = this.particles[a].x - this.particles[b].x;
          const dy = this.particles[a].y - this.particles[b].y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance){
            context.save();
            const opacity = 1 - (distance/maxDistance);
            context.globalAlpha = opacity; 
            context.beginPath();
            context.moveTo(this.particles[a].x, this.particles[a].y);
            context.lineTo(this.particles[b].x, this.particles[b].y);
            context.stroke();
            context.restore();
          }
        }
      }
    }
      resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
          particle.reset();
        })
      }
}


window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = 'white';

    const effect = new Effect(canvas, ctx);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.handlePaticles(ctx);
        requestAnimationFrame(animate);
    }
    animate();

});