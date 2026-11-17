// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const form = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const statusEl = document.querySelector('#status');
const eventList = document.querySelector('#event-list');

// Câu 2a
const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  return remaining > 0 ? `Còn ${remaining}/${event.capacity} chỗ` : 'Hết chỗ';
};

// Câu 2b
const createCard = (event) => {
  const card = document.createElement('article');
  card.className = 'event-card';

  const img = document.createElement('img');
  img.setAttribute('src', 'img/event.svg');
  img.setAttribute('alt', `Ảnh minh hoạ ${event.name}`);

  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
  link.textContent = event.name;
  heading.append(link);

  const timeP = document.createElement('p');
  const time = document.createElement('time');
  time.setAttribute('datetime', event.startTime);
  time.textContent = formatDateTime(event.startTime);
  timeP.append(time);

  const locationP = document.createElement('p');
  locationP.textContent = event.location;

  const seatsP = document.createElement('p');
  const seats = document.createElement('span');
  seats.className = 'seats';
  seats.textContent = formatSeats(event);
  if (event.registeredCount >= event.capacity) {
    seats.classList.add('seats--full');
  }
  seatsP.append(seats);

  card.append(img, heading, timeP, locationP, seatsP);
  return card;
};

const renderEvents = (events) => {
  eventList.replaceChildren(...events.map(createCard));
};

// Câu 2c
const loadEvents = async (keyword = '') => {
  const params = new URLSearchParams({ pageSize: '50' });
  if (keyword !== '') {
    params.set('q', keyword);
  }

  statusEl.textContent = 'Đang tải…';
  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    renderEvents(data.items);
    statusEl.textContent = data.items.length > 0
      ? `Tìm thấy ${data.totalCount} sự kiện`
      : 'Không có sự kiện nào khớp từ khoá.';
  } catch (error) {
    eventList.replaceChildren();
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});

loadEvents();