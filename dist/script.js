
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()


// fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Door texture
const doorColorTexture = textureLoader.load('doorColor.jpg')
const doorAlphaTexture = textureLoader.load('doorAlpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('doorAmbientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('doorHeight.jpg')
const doorMetalnessTexture = textureLoader.load('doorMetalness.jpg')
const doorNormalTexture = textureLoader.load('doorNormal.jpg')
const doorRoughnessTexture = textureLoader.load('doorRoughness.jpg')

// Brick Texture
const brickAmbientOcclusion = textureLoader.load('bricksAmbientOcclusion.jpg')
const brickColorTexture = textureLoader.load('bricksColor.jpg')
const brickNormalTexture = textureLoader.load('bricksNormal.jpg')
const brickRoughnessTexture = textureLoader.load('bricksRoughness.jpg')

// Floor Texture
const floorAmbientOcclusionTexture = textureLoader.load('grassAmbientOcclusion.jpg')
const floorColorTexture = textureLoader.load('grassColor.jpg')
const floorNormalTexture = textureLoader.load('grassNormal.jpg')
const floorRoughnessTexture = textureLoader.load('grassRoughness.jpg')

floorColorTexture.repeat.set(8,8)
floorAmbientOcclusionTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorRoughnessTexture.repeat.set(8,8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorRoughnessTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorRoughnessTexture.wrapT = THREE.RepeatWrapping


/**
 * House
 */
// Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls= new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        color: '#ac8e82',
        aoMap: brickAmbientOcclusion,
        map: brickColorTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
    })
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))
walls.position.y = 2.5 / 2

house.add(walls)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        transparent: true
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))

door.position.z = 4/2+0.0001
door.position.y = (2/2) - 0.1

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c894'})

const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

house.add(bush1, bush2, bush3, bush4)


// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Graves

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * (Math.PI * 2)
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle)* radius
    const z = Math.cos(angle)* radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        aoMap: floorAmbientOcclusionTexture,
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        roughness: floorRoughnessTexture
    })
)

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0,2.2,2.7)

house.add(doorLight)

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#FF00FF', 2,3)

scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2,3)

scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2,3)

scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')


/**
 * Shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


moonLight.castShadow = true;


doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3) 
    
    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 0.25) 

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7+Math.sin(elapsedTime)* 0.32)
    ghost3.position.z = Math.sin(ghost3Angle) * (7+ Math.sin(elapsedTime) * 0.5)
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) 
    
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()