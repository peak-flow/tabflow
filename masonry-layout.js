// Masonry layout implementation
function applyMasonryLayout() {
  const container = document.getElementById('windowsContainer');
  if (!container || !container.classList.contains('masonry-container')) {
    console.log('Masonry: Container not found or not masonry');
    return;
  }
  
  const cards = Array.from(container.querySelectorAll('.window-card'));
  if (cards.length === 0) {
    console.log('Masonry: No cards found');
    return;
  }
  
  console.log('Masonry: Applying layout to', cards.length, 'cards');
  
  // Get number of columns based on view mode
  let columns = 3;
  if (container.classList.contains('list-view')) {
    columns = 1;
  } else if (container.classList.contains('full-grid-view')) {
    columns = 4;
  }
  
  // Responsive columns
  if (window.innerWidth <= 768) {
    columns = 1;
  } else if (window.innerWidth <= 1200 && columns > 2) {
    columns = 2;
  }
  
  const gap = 24;
  const containerWidth = container.offsetWidth;
  const columnWidth = (containerWidth - (gap * (columns - 1))) / columns;
  
  console.log('Masonry: Container width:', containerWidth, 'Column width:', columnWidth, 'Columns:', columns);
  
  // Initialize column heights
  const columnHeights = new Array(columns).fill(0);
  
  // Set container to relative positioning
  container.style.position = 'relative';
  
  // Process cards in sequence to avoid race conditions
  cards.forEach((card, index) => {
    // Reset any existing positioning
    card.style.position = 'absolute';
    card.style.width = columnWidth + 'px';
    card.style.transition = 'all 0.3s ease';
    
    // Get card height after width is set
    const cardHeight = card.offsetHeight;
    
    // Find shortest column
    let shortestColumn = 0;
    let minHeight = columnHeights[0];
    
    for (let i = 1; i < columns; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        shortestColumn = i;
      }
    }
    
    // Set card position
    card.style.left = (shortestColumn * (columnWidth + gap)) + 'px';
    card.style.top = columnHeights[shortestColumn] + 'px';
    
    console.log('Masonry: Card', index, 'height:', cardHeight, 'column:', shortestColumn, 'top:', columnHeights[shortestColumn]);
    
    // Update column height
    columnHeights[shortestColumn] += cardHeight + gap;
  });
  
  // Set container height
  const maxHeight = Math.max(...columnHeights);
  container.style.height = maxHeight + 'px';
  console.log('Masonry: Final container height:', maxHeight);
}

// Debounced resize function
let resizeTimeout;
function debouncedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(applyMasonryLayout, 250);
}

// Initialize masonry when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Masonry: DOM loaded, setting up listeners');
  
  // Apply initial layout
  setTimeout(applyMasonryLayout, 500);
  
  // Listen for custom event from manager-masonry.js
  document.addEventListener('windowsRendered', () => {
    console.log('Masonry: Windows rendered event received');
    setTimeout(applyMasonryLayout, 100);
  });
  
  // Reapply on window resize
  window.addEventListener('resize', debouncedResize);
  
  // Watch for layout changes
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
        shouldReapply = true;
      }
    });
    if (shouldReapply) {
      console.log('Masonry: Layout change detected, reapplying');
      setTimeout(applyMasonryLayout, 100);
    }
  });
  
  // Start observing after a delay
  setTimeout(() => {
    const container = document.getElementById('windowsContainer');
    if (container) {
      observer.observe(container, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: false
      });
      console.log('Masonry: Observer started');
    }
  }, 1000);
});