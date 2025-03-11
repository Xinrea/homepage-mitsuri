const commentsContainer = document.querySelector(".comments-container");
const commentForm = document.querySelector("#comment-form");
const contentTextarea = commentForm?.querySelector('textarea[name="content"]');
const charCounter = document.querySelector("#char-count");

// 计算字符串的实际显示长度（将中文字符计为1）
function getStringLength(str) {
  return [...str].length;
}

// 更新字符计数
function updateCharCount() {
  if (!contentTextarea || !charCounter) return;

  const count = getStringLength(contentTextarea.value);
  charCounter.textContent = count;

  const counterElement = charCounter.parentElement;
  if (count >= 90) {
    counterElement.classList.add("at-limit");
    counterElement.classList.remove("near-limit");
  } else if (count >= 75) {
    counterElement.classList.add("near-limit");
    counterElement.classList.remove("at-limit");
  } else {
    counterElement.classList.remove("near-limit", "at-limit");
  }
}

// 添加字符计数监听器
contentTextarea?.addEventListener("input", updateCharCount);

// 从API获取评论数据
async function fetchComments() {
  try {
    const response = await fetch("https://api-fc.vjoi.cn/topics");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// 创建评论卡片元素
function createCommentCard(comment) {
  const card = document.createElement("div");
  card.className = "comment-card";

  // 添加点击事件跳转到bilibili
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    if (comment.id_str) {
      window.open(`https://www.bilibili.com/opus/${comment.id_str}`, "_blank");
    }
  });

  const username = document.createElement("div");
  username.className = "comment-username";
  username.textContent = "@" + comment.authorName;

  const content = document.createElement("div");
  content.className = "comment-content";
  // limit 80 characters
  if (comment.descText.length > 80) {
    content.textContent = comment.descText.slice(0, 80) + "...";
  } else {
    content.textContent = comment.descText;
  }

  const timestamp = document.createElement("div");
  timestamp.className = "comment-timestamp";
  timestamp.textContent = comment.ts;

  card.appendChild(username);
  card.appendChild(content);
  card.appendChild(timestamp);

  // 添加悬停效果提示
  card.title = "点击查看原文";

  return card;
}

// 显示错误消息
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  const commentsContainer = document.querySelector(".comments-container");
  if (commentsContainer) {
    commentsContainer.insertBefore(errorDiv, commentsContainer.firstChild);
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}

// 加载评论
async function loadComments() {
  try {
    const comments = await fetchComments();
    const commentsContainer = document.querySelector(".comments-container");
    if (!commentsContainer) return;

    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
      commentsContainer.appendChild(createCommentCard(comment));
    });
  } catch (error) {
    console.error("Error loading comments:", error);
    showError("Failed to load comments. Please try again later.");
  }
}

// 页面加载完成后加载评论
document.addEventListener("DOMContentLoaded", loadComments);

// 初始加载
loadComments();
// 初始化字符计数
updateCharCount();
