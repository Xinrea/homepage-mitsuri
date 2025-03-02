document.addEventListener("DOMContentLoaded", () => {
  // 获取主要文字内容
  const mainText = document.querySelector(".glitch").textContent;
  const subText = document.querySelector(".glitch-subtitle").textContent;
  const texts = [mainText, subText];

  // 获取飞船元素
  const spaceship = document.querySelector(".spaceship");
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let currentAngle = 0;

  // 飞船跟随动画
  function updateSpaceshipPosition() {
    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // 计算目标角度（弧度）
    const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;

    // 平滑角度变化
    let angleDiff = targetAngle - currentAngle;

    // 确保角度差在 -PI 到 PI 之间
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // 平滑插值角度
    currentAngle += angleDiff * 0.2;

    // 更新位置
    currentX += dx * 0.2;
    currentY += dy * 0.2;

    // 应用位置和旋转
    spaceship.style.left = `${currentX}px`;
    spaceship.style.top = `${currentY}px`;
    spaceship.style.transform = `translate(-50%, -50%) rotate(${currentAngle}rad)`;

    requestAnimationFrame(updateSpaceshipPosition);
  }

  // 监听鼠标移动
  document.addEventListener("mousemove", (e) => {
    // 设置目标位置为鼠标位置
    targetX = e.clientX;
    targetY = e.clientY;

    // 更新文字 3D 效果，但排除粉丝数框
    const glitchElements = document.querySelectorAll(
      ".glitch, .glitch-subtitle"
    );
    glitchElements.forEach((element) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      element.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  });

  // 初始化飞船位置
  spaceship.style.left = `${currentX}px`;
  spaceship.style.top = `${currentY}px`;
  updateSpaceshipPosition();

  // 随机生成故障效果的函数
  function createRandomGlitch() {
    const glitchElements = document.querySelectorAll(
      ".glitch, .glitch-subtitle"
    );

    glitchElements.forEach((element) => {
      if (Math.random() > 0.99) {
        element.style.transform = `translate(${Math.random() * 10 - 5}px, ${
          Math.random() * 10 - 5
        }px)`;
        setTimeout(() => {
          element.style.transform = "translate(0, 0)";
        }, 100);
      }
    });
  }

  // 创建闪现文字的函数
  function createFlashText() {
    // 随机选择文字
    const text = texts[Math.floor(Math.random() * texts.length)];

    // 创建容器元素
    const container = document.createElement("div");
    container.className = "flash-text-container";

    // 创建文字元素
    const flashElement = document.createElement("div");
    flashElement.className = "flash-text";
    flashElement.textContent = text;
    flashElement.setAttribute("data-text", text);

    // 将文字元素添加到容器中
    container.appendChild(flashElement);

    // 随机位置
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);

    // 设置位置和样式
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.animation = "flashIn 1.2s ease-out forwards";

    // 添加到页面
    document.body.appendChild(container);

    // 动画结束后移除元素
    setTimeout(() => {
      container.remove();
    }, 1200);
  }

  // 每50ms执行一次随机故障效果
  setInterval(createRandomGlitch, 50);

  // 随机间隔创建闪现文字
  function scheduleNextFlash() {
    const delay = Math.random() * 2000 + 1000; // 1-3秒随机间隔
    setTimeout(() => {
      createFlashText();
      scheduleNextFlash();
    }, delay);
  }

  scheduleNextFlash();

  // 获取已有的文字容器
  const textContent = document.querySelector(".text-content");

  // 添加点击事件处理
  textContent.addEventListener("click", (e) => {
    // 如果点击的是直播状态链接或其子元素，不执行跳转
    if (e.target.closest(".live-status")) {
      return;
    }
    window.location.href = "https://space.bilibili.com/2030198123";
  });

  // Three.js Avatar Setup
  let scene, camera, renderer, cylinder;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let mouseLight; // 添加鼠标光源变量

  function initAvatar() {
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机 - 调整视角
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.z = 6; // 增加相机距离

    // 创建渲染器
    const canvas = document.getElementById("avatar3D");
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    // 获取容器的实际尺寸
    const container = document.querySelector(".avatar-container");
    const size = container.clientWidth;
    renderer.setSize(size, size);

    // 添加窗口大小变化监听
    window.addEventListener("resize", () => {
      const newSize = container.clientWidth;
      renderer.setSize(newSize, newSize);
    });

    // 创建圆形平面（替代圆柱体）
    const geometry = new THREE.CircleGeometry(1.5, 64); // 增加几何体大小

    // 加载头像纹理
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("avatar.jpg", (texture) => {
      // 设置纹理参数以提高清晰度
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.8, // 增加粗糙度，减少反光
        metalness: 0.05, // 进一步降低金属感
        clearcoat: 0.2, // 减少清漆层强度
        clearcoatRoughness: 0.5, // 增加清漆层粗糙度
        transmission: 0.02, // 降低透光性
        envMapIntensity: 0.3, // 降低环境反射强度
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98,
      });

      cylinder = new THREE.Mesh(geometry, material);
      cylinder.rotation.y = Math.PI;
      scene.add(cylinder);

      // 调整环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.35); // 降低环境光强度
      scene.add(ambientLight);

      // 重新配置光源位置和强度
      const topLight = new THREE.PointLight(0xffffff, 0.25); // 降低顶部光源强度
      topLight.position.set(0, 4, 3);
      scene.add(topLight);

      // 添加侧面补光
      const leftLight = new THREE.PointLight(0xffffff, 0.15); // 降低侧光强度
      leftLight.position.set(-4, 2, 3);
      scene.add(leftLight);

      const rightLight = new THREE.PointLight(0xffffff, 0.15); // 降低侧光强度
      rightLight.position.set(4, 2, 3);
      scene.add(rightLight);

      // 添加正面柔光
      const frontLight = new THREE.PointLight(0xffffff, 0.1); // 降低正面光源强度
      frontLight.position.set(0, 0, 5);
      scene.add(frontLight);

      // 更新鼠标跟随光源
      mouseLight = new THREE.PointLight(0xffffff, 0.2); // 降低鼠标光源强度
      mouseLight.position.set(0, 0, 4);
      scene.add(mouseLight);

      // 开始动画
      animate();
    });

    // 添加鼠标移动事件
    canvas.addEventListener("mousemove", onMouseMove);
  }

  function onMouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 减小旋转角度范围
    targetRotationY = (x * Math.PI) / 8;
    targetRotationX = (y * Math.PI) / 12;

    // 更新鼠标光源位置
    if (mouseLight) {
      // 将鼠标位置映射到3D空间
      mouseLight.position.x = x * 3; // 增加光源移动范围
      mouseLight.position.y = y * 3; // 增加光源移动范围
      mouseLight.position.z = 4;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (cylinder) {
      // 平滑过渡到目标旋转角度
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;

      cylinder.rotation.x = currentRotationX;
      cylinder.rotation.y = Math.PI + currentRotationY;

      // 移除自动旋转
      // cylinder.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  // 初始化3D头像
  initAvatar();

  // 添加粉丝数更新逻辑
  let lastFollowerCount = null;
  let updateInterval = null;

  async function updateFollowerCount() {
    const followerNumberElement = document.querySelector(".follower-number");

    try {
      const response = await axios.get("https://api-fc.vjoi.cn/status");
      console.log("API Response:", response.data);

      const { follower } = response.data;

      // 检查是否获取到有效的粉丝数
      if (typeof follower !== "number") {
        console.error("Invalid follower count received:", response.data);
        return;
      }

      // 如果是第一次获取数据或者数据有变化
      if (lastFollowerCount === null || lastFollowerCount !== follower) {
        console.log(
          "Updating follower count from",
          lastFollowerCount,
          "to",
          follower
        );

        // 更新显示
        followerNumberElement.textContent = follower.toLocaleString();

        // 保存最新的粉丝数
        lastFollowerCount = follower;
      } else {
        console.log("Follower count unchanged:", follower);
      }
    } catch (error) {
      console.error("Failed to update follower count:", error.message);
      if (!lastFollowerCount && followerNumberElement.textContent === "--") {
        followerNumberElement.textContent = "--";
      }
    }
  }

  // 页面加载完成后立即更新一次
  console.log("Starting follower count updates");
  updateFollowerCount();

  // 清除可能存在的旧定时器
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  // 每10秒更新一次
  updateInterval = setInterval(() => {
    console.log("Running scheduled update");
    updateFollowerCount();
  }, 10000);

  // 更新直播状态
  function updateLiveStatus(isLive) {
    const liveDot = document.querySelector(".live-dot");
    const liveText = document.querySelector(".live-text");

    if (isLive) {
      liveDot.classList.add("active");
      liveText.classList.add("active");
      liveText.textContent = "LIVE";
    } else {
      liveDot.classList.remove("active");
      liveText.classList.remove("active");
      liveText.textContent = "OFFLINE";
    }
  }

  // 获取直播状态和粉丝数
  async function fetchStatusAndFollowers() {
    try {
      const response = await fetch("https://api-fc.vjoi.cn/status");
      const data = await response.json();

      // 更新直播状态
      updateLiveStatus(data.is_live);

      // 更新粉丝数
      const followerNumber = document.querySelector(".follower-number");
      followerNumber.textContent = data.follower.toLocaleString();
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  }

  // 初始获取状态
  fetchStatusAndFollowers();

  // 每60秒更新一次状态
  setInterval(fetchStatusAndFollowers, 60000);
});
