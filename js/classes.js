
/* This function creates the in-game sprites */
class Sprite {

    // We have {} for the argument so that we are only passing through one argument within this object. The order doesn't matter anymore as they are properties.
    constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 }
    }) {
      this.position = position
      this.width = 50
      this.height = 150

      // Drawing the sprite images
      this.image = new Image()
      this.image.src = imageSrc

      this.scale = scale
      this.framesMax = framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5 // Changing framesHold would make the animation go faster or slower
      this.offset = offset
    }
  
    // What our Sprite is going to look like (with the image)
    draw() {

      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      )
    }
  
    animateFrames() {
      this.framesElapsed++
  
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++
        } else {
          this.framesCurrent = 0
        }
      }
    }
  
    update() {
      this.draw()
      this.animateFrames()
    }
  }
  


/* This function creates the character's sprites, extends the sprites class so we can utilize the animation functions */
class Fighter extends Sprite {
    // We have {} for the argument so that we are only passing through one argument within this object. The order doesn't matter anymore as they are properties.
    constructor({position, velocity, attackPoint, color, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, sprites, attackBox = {offset: {}, width: undefined, height: undefined}}) {
        
      super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
      })

        this.velocity = velocity
        this.attackPoint = attackPoint
        this.width = 50
        this.height = 150
        this.lastKey
        this.pressedJump = false
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset 
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.dead = false

        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6
        this.sprites = sprites

        for (const sprite in this.sprites) {
          sprites[sprite].image = new Image()
          sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    // What our Sprite is going to look like (rectangular version)
    // draw() {
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
    //     // Where the attack box is drawn
    //     if (this.isAttacking){
    //         c.fillStyle = 'green'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw(); 

        if(!this.dead){
          this.animateFrames();
        }

        // Attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // This is where we draw the attack boxes
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;   

        if (this.pressedJump && this.position.y + this.height >= canvas.height-96) {
            this.velocity.y = -20;
        }

        if (this.position.y + this.height + this.velocity.y >= canvas.height-96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
      this.switchSprite('attack1')
        this.isAttacking = true
        
        // After 100 milliseconds the isAttacking will be turned to false
        // setTimeout(() => {
        //     this.isAttacking = false
        // }, 1000) 
    }

    takeHit(damage) {
      this.health -= damage

      if (this.health <= 0) {
        this.switchSprite('death')
      } else {
        this.switchSprite('takeHit')
      }
    }

    switchSprite(sprite) {

      // So when the player presses on attack, then the character sprite would animate an attack 
      // instead of going back to the idle animation. FramesCurrent starts at 0 and our framesMax 
      // is the actual amount of frames starting at 1 and now if the image is the attack image and
      // the frame is less than the framesMax of the actual sprite sheet, then we just want to return 
      // and we don't want to call any of the following code but as soon as framesCurrent goes above the 
      // framesMax, then we are going to continue, allowing us to switch back to either idle, run or jump
      // animations.
      if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

      // Override when fighter gets hit
      if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

      // Override when fighter dies
      if (this.image === this.sprites.death.image) {
        if (this.framesCurrent === this.sprites.death.framesMax - 1){
          this.dead = true
        }
        return
      }


      switch (sprite) {
        case 'idle':
          if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.framesCurrent = 0
          }
         break

        case 'run':
          if (this.image !== this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMax = this.sprites.run.framesMax
            this.framesCurrent = 0
          }
          break

        case 'jump':
          if (this.image !== this.sprites.jump.image) {
            this.image = this.sprites.jump.image
            this.framesMax = this.sprites.jump.framesMax
            this.framesCurrent = 0
          }
          break

        case 'fall':
          if (this.image !== this.sprites.fall.image) {
            this.image = this.sprites.fall.image
            this.framesMax = this.sprites.fall.framesMax
            this.framesCurrent = 0
          }
          break
          
        case 'attack1':
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image
            this.framesMax = this.sprites.attack1.framesMax
            this.framesCurrent = 0
          }
          break

        case 'takeHit':
          if (this.image !== this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image
            this.framesMax = this.sprites.takeHit.framesMax
            this.framesCurrent = 0
          }
          break

        case 'death':
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.framesMax = this.sprites.death.framesMax
            this.framesCurrent = 0
          }
          break
      }
    }
}