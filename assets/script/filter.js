// Lọc khách sạn theo loại, số sao và tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.main-search-bar__form');
  const searchInput = document.querySelector('.main-search-bar__input');
  const typeFilters = document.querySelectorAll('input[name="accommodation-type"]');
  const starFilters = document.querySelectorAll('input[name="star-rating"]');
  let currentFilters = {
    type: [],
    stars: [],
    searchText: ''
  };
  // Xử lý tìm kiếm
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentFilters.searchText = searchInput.value.trim();
    applyFilters();
  });
  // Xử lý lọc theo loại
  typeFilters.forEach(filter => {
    filter.addEventListener('change', () => {
      currentFilters.type = [...typeFilters]
        .filter(f => f.checked)
        .map(f => f.value);
      applyFilters();
    });
  });
  // Xử lý lọc theo số sao  
  starFilters.forEach(filter => {
    filter.addEventListener('change', () => {
      currentFilters.stars = [...starFilters]
        .filter(f => f.checked)
        .map(f => parseInt(f.value));
      applyFilters();
    });
  });
async function applyFilters() {
  try {
    const queryParams = new URLSearchParams();
    
    // Xử lý các tham số lọc riêng biệt
    if (currentFilters.type.length) {
      queryParams.append('type', currentFilters.type.join(','));
    }
    
    if (currentFilters.stars.length) {
      queryParams.append('stars', currentFilters.stars.join(','));
    }
    
    if (currentFilters.searchText) {
      queryParams.append('name', currentFilters.searchText);
    }
    // Thêm tham số island để lọc theo đảo cụ thể
    const currentPath = window.location.pathname;
    if (currentPath.includes('phuquoc')) {
      queryParams.append('island', 'PhuQuoc');
    } else if (currentPath.includes('phuquy')) {
      queryParams.append('island', 'PhuQuy'); 
    } else if (currentPath.includes('binhhung')) {
      queryParams.append('island', 'BinhHung');
    }
    const response = await fetch(`http://localhost:5000/api/hotels?${queryParams}`);
    const hotels = await response.json();
    renderHotels(hotels);
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}
});