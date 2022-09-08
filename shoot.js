AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        bullet.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera-rig");
        pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y + 1,
          z: pos.z - 0.5,
        });

        var camera = document.querySelector("#camera").object3D;

        //obtén la dirección de la cámara como vector Three.js 
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //Establece la velocidad y su dirección
        bullet.setAttribute("velocity", direction.multiplyScalar(-50));

        var scene = document.querySelector("#scene");

        //establece la bala como entidad dinámica
        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "50",
        });

        //Agrega el evento de escucha de colisión a la bala
        bullet.addEventListener("collide", this.removeBullet);

        scene.appendChild(bullet);

        //sonido de disparo
        this.shootSound();
      }
    });
  },
  removeBullet: function (e) {
    var scene = document.querySelector("#scene");
    
    //elemento de bala
    var element = e.detail.target.el;

    //elemento que es golpeado
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("enemy")) {
      
      var countTankEl = document.querySelector("#countTank");
      var tanksFired = parseInt(countTankEl.getAttribute("text").value);
      tanksFired -= 1;

      countTankEl.setAttribute("text", {
        value: tanksFired
      });

      if (tanksFired === 0) {
        var txt = document.querySelector("#completed");
        txt.setAttribute("visible", true);       
        
      }
      scene.removeChild(elementHit);
    }
    //elimina el evento de escucha
    element.removeEventListener("collide", this.removeBullet);

    //elimina las balas de la escena   
    scene.removeChild(element);
  },
  shootSound: function () {
    var entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});

