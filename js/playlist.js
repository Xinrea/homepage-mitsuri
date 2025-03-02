async function loadPlaylist() {
  try {
    const response = await fetch('data/playlist.json');
    const data = await response.json();
    const playlistContainer = document.querySelector('.playlist-container');
    
    // 设置页面容器的滚动吸附
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) {
      pageContainer.style.scrollSnapType = 'y mandatory';
      pageContainer.style.overflowY = 'scroll';
      pageContainer.style.height = '100vh';
      
      // 设置每个页面的滚动吸附
      const pages = document.querySelectorAll('.page');
      pages.forEach((page, index) => {
        page.style.scrollSnapAlign = 'start';
        page.style.scrollSnapStop = 'always';
        page.style.minHeight = '100vh';
        page.style.display = 'flex';
        page.style.flexDirection = 'column';
        page.style.justifyContent = 'center';
        page.style.position = 'relative';

        // 只给前三个页面添加滚动指示器
        if (index < 3) {
          const scrollIndicator = document.createElement('div');
          scrollIndicator.setAttribute('data-scroll-indicator', '');
          scrollIndicator.style.position = 'absolute';
          scrollIndicator.style.bottom = '20px';
          scrollIndicator.style.left = '50%';
          scrollIndicator.style.transform = 'translateX(-50%)';
          scrollIndicator.style.display = 'flex';
          scrollIndicator.style.flexDirection = 'column';
          scrollIndicator.style.alignItems = 'center';
          scrollIndicator.style.gap = '8px';
          scrollIndicator.style.color = '#fff';
          scrollIndicator.style.opacity = '0.7';
          scrollIndicator.style.animation = 'bounce 2s infinite';
          scrollIndicator.style.transition = 'opacity 0.3s ease';
          scrollIndicator.style.pointerEvents = 'none';
          
          // 添加文字提示
          const text = document.createElement('span');
          text.textContent = '向下滚动';
          text.style.fontSize = '14px';
          text.style.fontWeight = '300';
          text.style.letterSpacing = '1px';
          
          // 添加箭头图标
          const arrow = document.createElement('div');
          arrow.innerHTML = '↓';
          arrow.style.fontSize = '24px';
          arrow.style.lineHeight = '1';
          
          scrollIndicator.appendChild(text);
          scrollIndicator.appendChild(arrow);
          
          // 添加动画样式
          const style = document.createElement('style');
          style.textContent = `
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateX(-50%) translateY(0);
              }
              40% {
                transform: translateX(-50%) translateY(-10px);
              }
              60% {
                transform: translateX(-50%) translateY(-5px);
              }
            }
          `;
          document.head.appendChild(style);
          
          page.appendChild(scrollIndicator);
        }
      });

      // 监听滚动事件来控制指示器的显示/隐藏
      pageContainer.addEventListener('scroll', () => {
        const scrollIndicators = document.querySelectorAll('[data-scroll-indicator]');
        scrollIndicators.forEach(indicator => {
          const page = indicator.closest('.page');
          const pageRect = page.getBoundingClientRect();
          // 当页面开始滚出视图时，隐藏指示器
          indicator.style.opacity = pageRect.bottom > window.innerHeight * 0.7 ? '0.7' : '0';
        });
      });
    }
    
    // 创建外层容器
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '20px';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.padding = '20px';
    wrapper.style.boxSizing = 'border-box';
    
    // 创建网格容器
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gap = '20px';
    gridContainer.style.flex = '1';
    
    // 响应式布局
    function updateGridLayout() {
      if (window.innerWidth <= 768) {
        gridContainer.style.gridTemplateColumns = '1fr';
        gridContainer.style.maxWidth = '500px';
        gridContainer.style.margin = '0 auto';
      } else {
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gridContainer.style.maxWidth = 'none';
        gridContainer.style.margin = '0';
      }
    }

    // 初始化布局
    updateGridLayout();

    // 监听窗口大小变化
    window.addEventListener('resize', updateGridLayout);
    
    // 创建分页容器
    const paginationContainer = document.createElement('div');
    paginationContainer.style.display = 'flex';
    paginationContainer.style.justifyContent = 'center';
    paginationContainer.style.alignItems = 'center';
    paginationContainer.style.gap = '10px';
    paginationContainer.style.flexWrap = 'wrap';
    paginationContainer.style.padding = '20px 10px';
    paginationContainer.style.marginTop = 'auto';

    // 动态设置每页显示数量
    function getItemsPerPage() {
      return window.innerWidth <= 768 ? 2 : 6;
    }

    let ITEMS_PER_PAGE = getItemsPerPage();
    let totalPages = Math.ceil(data.playlist.length / ITEMS_PER_PAGE);
    let currentPage = 0;

    function createSongCard(song, index) {
      const songElement = document.createElement('div');
      songElement.className = 'song-card';
      
      // 添加歌曲信息
      const songInfo = document.createElement('div');
      songInfo.className = 'song-info';
      songInfo.style.padding = '10px 0';
      songInfo.innerHTML = `
        <h3 class="song-title" style="margin: 0 0 5px 0; font-size: 16px;">${song.title || 'Unknown Title'}</h3>
        <p class="song-artist" style="margin: 0; font-size: 14px; color: #666;">原唱：${song.original_artist || 'Unknown Artist'}</p>
      `;
      songElement.appendChild(songInfo);
      
      // 创建 iframe 播放器
      const iframeContainer = document.createElement('div');
      iframeContainer.style.width = '100%';
      iframeContainer.style.position = 'relative';
      iframeContainer.style.paddingTop = '56.25%';
      iframeContainer.style.marginBottom = '10px';
      
      const iframe = document.createElement('iframe');
      iframe.id = `player-${index}`;
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.src = `//player.bilibili.com/player.html?bvid=${song.cover_bvid}&autoplay=0&danmaku=0&high_quality=1`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      
      iframeContainer.appendChild(iframe);
      songElement.appendChild(iframeContainer);
      
      return songElement;
    }

    function updatePagination() {
      const newItemsPerPage = getItemsPerPage();
      if (newItemsPerPage !== ITEMS_PER_PAGE) {
        ITEMS_PER_PAGE = newItemsPerPage;
        totalPages = Math.ceil(data.playlist.length / ITEMS_PER_PAGE);
        currentPage = 0;
        
        // 重新创建分页按钮
        paginationContainer.innerHTML = '';
        const prevButton = createPaginationButton('←');
        paginationContainer.appendChild(prevButton);
        
        for (let i = 0; i < totalPages; i++) {
          const pageButton = createPaginationButton(String(i + 1), true);
          paginationContainer.appendChild(pageButton);
        }
        
        const nextButton = createPaginationButton('→');
        paginationContainer.appendChild(nextButton);
        
        // 重新添加事件监听
        addPaginationListeners();
        
        // 更新页面内容
        updatePage(0);
      }
    }

    // 监听窗口大小变化以更新分页
    window.addEventListener('resize', updatePagination);

    function updatePage(page) {
      currentPage = page;
      gridContainer.innerHTML = '';
      
      const start = page * ITEMS_PER_PAGE;
      const end = Math.min(start + ITEMS_PER_PAGE, data.playlist.length);
      
      for (let i = start; i < end; i++) {
        const songCard = createSongCard(data.playlist[i], i);
        gridContainer.appendChild(songCard);
      }

      // 更新分页按钮状态
      Array.from(paginationContainer.children).forEach((button, index) => {
        if (index === 0) { // Prev button
          button.disabled = page === 0;
          button.style.opacity = page === 0 ? '0.5' : '1';
        } else if (index === paginationContainer.children.length - 1) { // Next button
          button.disabled = page === totalPages - 1;
          button.style.opacity = page === totalPages - 1 ? '0.5' : '1';
        } else { // Page numbers
          button.classList.toggle('active', index - 1 === page);
          if (index - 1 === page) {
            button.style.backgroundColor = '#fff';
            button.style.color = '#1a1a1a';
            button.style.borderColor = '#fff';
          } else {
            button.style.backgroundColor = 'transparent';
            button.style.color = '#fff';
            button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }
        }
      });
    }

    // 创建分页按钮
    const createPaginationButton = (text, isPageNumber = false) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.padding = '8px 12px';
      button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
      button.style.borderRadius = '4px';
      button.style.background = 'transparent';
      button.style.color = '#fff';
      button.style.cursor = 'pointer';
      button.style.transition = 'all 0.3s ease';
      button.style.minWidth = '40px';
      button.style.fontSize = '14px';
      button.style.margin = '5px';
      
      if (isPageNumber) {
        button.addEventListener('mouseover', () => {
          if (!button.classList.contains('active')) {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }
        });
        button.addEventListener('mouseout', () => {
          if (!button.classList.contains('active')) {
            button.style.backgroundColor = 'transparent';
            button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }
        });
      }
      
      return button;
    };

    function addPaginationListeners() {
      const buttons = Array.from(paginationContainer.children);
      
      // 上一页按钮
      buttons[0].addEventListener('click', () => {
        if (currentPage > 0) {
          updatePage(currentPage - 1);
        }
      });

      // 下一页按钮
      buttons[buttons.length - 1].addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
          updatePage(currentPage + 1);
        }
      });

      // 页码按钮
      buttons.slice(1, -1).forEach((button, index) => {
        button.addEventListener('click', () => {
          updatePage(index);
        });
      });
    }

    // 添加分页按钮
    const prevButton = createPaginationButton('←');
    paginationContainer.appendChild(prevButton);
    
    for (let i = 0; i < totalPages; i++) {
      const pageButton = createPaginationButton(String(i + 1), true);
      paginationContainer.appendChild(pageButton);
    }
    
    const nextButton = createPaginationButton('→');
    paginationContainer.appendChild(nextButton);

    // 添加分页事件监听
    addPaginationListeners();

    // 将网格容器和分页容器添加到包装器中
    wrapper.appendChild(gridContainer);
    wrapper.appendChild(paginationContainer);
    
    // 将包装器添加到播放列表容器中
    playlistContainer.appendChild(wrapper);

    // 初始化第一页
    updatePage(0);

  } catch (error) {
    console.error('Error loading playlist:', error);
  }
}

// 格式化时间
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', loadPlaylist); 