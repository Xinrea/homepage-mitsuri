// 加载 About Me 数据
async function loadAboutData() {
  try {
    const response = await fetch("/data/about.json");
    const data = await response.json();
    renderAboutSections(data);
  } catch (error) {
    console.error("Error loading about data:", error);
  }
}

// 渲染 About Me 各个部分
function renderAboutSections(data) {
  const aboutGrid = document.querySelector(".about-grid");
  if (!aboutGrid) return;

  // 清空现有内容
  aboutGrid.innerHTML = "";

  // 渲染个人信息部分
  aboutGrid.appendChild(createSection(data.personalInfo));

  // 渲染喜欢和不喜欢部分
  aboutGrid.appendChild(createLikeDislikeSection(data.likesAndDislikes));

  // 渲染游戏部分
  aboutGrid.appendChild(createListSection(data.games, "game-list"));

  // 渲染音乐部分
  aboutGrid.appendChild(createListSection(data.music, "music-list"));
}

// 创建基础部分
function createSection(sectionData) {
  const section = document.createElement("div");
  section.className = "about-section";

  const title = document.createElement("h3");
  title.innerHTML = `${sectionData.icon} ${sectionData.title}`;

  const list = document.createElement("ul");
  list.className = "about-list";

  sectionData.items.forEach((item) => {
    const li = document.createElement("li");
    // 处理带星号的强调文本
    if (item.includes("*")) {
      li.innerHTML = item.replace(/\*(.*?)\*/g, "<em>$1</em>");
    } else if (item.includes("[icon]")) {
      const icon = document.createElement("img");
      icon.src = "icon.png";
      icon.style.width = "28px";
      li.textContent = item.replace("[icon]", "");
      li.appendChild(icon);
    } else {
      li.textContent = item;
    }
    list.appendChild(li);
  });

  section.appendChild(title);
  section.appendChild(list);
  return section;
}

// 创建喜欢和不喜欢部分
function createLikeDislikeSection(sectionData) {
  const section = document.createElement("div");
  section.className = "about-section";

  const title = document.createElement("h3");
  title.innerHTML = `${sectionData.icon} ${sectionData.title}`;

  const container = document.createElement("div");
  container.className = "likes-dislikes";

  // 创建喜欢部分
  const likesDiv = document.createElement("div");
  const likesTitle = document.createElement("h4");
  likesTitle.textContent = sectionData.likes.title;
  const likesList = document.createElement("ul");
  likesList.className = "about-list";
  sectionData.likes.items.forEach((item) => {
    const li = document.createElement("li");
    if (item.includes("*")) {
      li.innerHTML = item.replace(/\*(.*?)\*/g, "<em>$1</em>");
    } else {
      li.textContent = item;
    }
    likesList.appendChild(li);
  });
  likesDiv.appendChild(likesTitle);
  likesDiv.appendChild(likesList);

  // 创建不喜欢部分
  const dislikesDiv = document.createElement("div");
  const dislikesTitle = document.createElement("h4");
  dislikesTitle.textContent = sectionData.dislikes.title;
  const dislikesList = document.createElement("ul");
  dislikesList.className = "about-list";
  sectionData.dislikes.items.forEach((item) => {
    const li = document.createElement("li");
    if (item.includes("*")) {
      li.innerHTML = item.replace(/\*(.*?)\*/g, "<em>$1</em>");
    } else {
      li.textContent = item;
    }
    dislikesList.appendChild(li);
  });
  dislikesDiv.appendChild(dislikesTitle);
  dislikesDiv.appendChild(dislikesList);

  container.appendChild(likesDiv);
  container.appendChild(dislikesDiv);

  section.appendChild(title);
  section.appendChild(container);
  return section;
}

// 创建列表部分（游戏和音乐）
function createListSection(sectionData, listClass) {
  const section = document.createElement("div");
  section.className = "about-section";

  const title = document.createElement("h3");
  title.innerHTML = `${sectionData.icon} ${sectionData.title}`;

  const list = document.createElement("div");
  list.className = listClass;

  sectionData.items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = `${listClass.replace("list", "item")}`;
    itemDiv.textContent = item;
    list.appendChild(itemDiv);
  });

  section.appendChild(title);
  section.appendChild(list);
  return section;
}

// 页面加载时初始化
document.addEventListener("DOMContentLoaded", loadAboutData);
