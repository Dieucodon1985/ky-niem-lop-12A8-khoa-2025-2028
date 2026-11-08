// Các tương tác dùng JavaScript thuần, không cần cài thư viện.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copyright-year").forEach(year => {
    year.textContent = new Date().getFullYear();
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
      menuButton.textContent = opened ? "×" : "☰";
    });
  }

  // Tìm kiếm thành viên
  const search = document.querySelector("#memberSearch");
  const memberCards = [...document.querySelectorAll(".member-card")];
  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase("vi");
      let visible = 0;
      memberCards.forEach(card => {
        const match = card.textContent.toLocaleLowerCase("vi").includes(query);
        card.hidden = !match;
        if (match) visible++;
      });
      const count = document.querySelector("#memberCount");
      if (count) count.textContent = `Tìm thấy ${visible}/${memberCards.length} thành viên`;
    });
  }
  const banner = document.querySelector(".banner");
  if (banner) {
    let ticking = false;
    let targetShift = 0;
    let targetOpacity = 1;
    let currentShift = 0;
    let currentOpacity = 1;
    let animationFrame = 0;
    const updateBanner = () => {
      const maxShift = banner.offsetHeight * 0.3;
      targetShift = Math.min(window.scrollY * 0.25, maxShift);
      const fadeStart = banner.offsetHeight * 0.8;
      const fadeDistance = Math.max(banner.offsetHeight * 0.7, 1);
      const fadeProgress = Math.min(Math.max((window.scrollY - fadeStart) / fadeDistance, 0), 1);
      targetOpacity = 1 - fadeProgress * 0.75;
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateBanner);
    };
    const animateBanner = () => {
      currentShift += (targetShift - currentShift) * 0.12;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;
      banner.style.setProperty("--banner-shift", `${currentShift}px`);
      banner.style.setProperty("--banner-opacity", currentOpacity);
      if (Math.abs(targetShift - currentShift) > 0.1 || Math.abs(targetOpacity - currentOpacity) > 0.005) {
        animationFrame = window.requestAnimationFrame(animateBanner);
      } else {
        currentShift = targetShift;
        currentOpacity = targetOpacity;
        banner.style.setProperty("--banner-shift", `${currentShift}px`);
        banner.style.setProperty("--banner-opacity", currentOpacity);
        animationFrame = 0;
      }
    };
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateBanner();
        ticking = false;
      });
    }, { passive: true });
    updateBanner();
  }

  // Bộ lọc album và hộp xem ảnh lớn
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const galleryTriggers = document.querySelectorAll(".gallery-item, .feature-card[data-full], .photo-frame[data-full]");
  const heroPhotoFrame = document.querySelector(".photo-frame[data-full]");
  if (heroPhotoFrame) {
    const heroPhoto = heroPhotoFrame.querySelector("img");
    const slides = [
      heroPhotoFrame,
      ...[...galleryTriggers].filter(item => item.matches(".feature-card"))
    ].map(item => ({
      src: item.dataset.full || item.querySelector("img").src,
      alt: item.querySelector("img").alt
    }));
    let slideIndex = 0;
    window.setInterval(() => {
      slideIndex = (slideIndex + 1) % slides.length;
      const slide = slides[slideIndex];
      heroPhoto.style.opacity = "0.35";
      window.setTimeout(() => {
        heroPhoto.src = slide.src;
        heroPhoto.alt = slide.alt;
        heroPhotoFrame.dataset.full = slide.src;
        window.requestAnimationFrame(() => {
          heroPhoto.style.opacity = "1";
        });
      }, 180);
    }, 4000);
  }
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      galleryItems.forEach(item => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });
  const lightbox = document.querySelector("#lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    let activeGalleryItems = [];
    let currentImageIndex = 0;
    const showImage = index => {
      if (!activeGalleryItems.length) return;
      currentImageIndex = (index + activeGalleryItems.length) % activeGalleryItems.length;
      const item = activeGalleryItems[currentImageIndex];
      const thumbnail = item.querySelector("img");
      lightboxImage.src = item.dataset.full || thumbnail.src;
      lightboxImage.alt = thumbnail.alt;
    };
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    };
    galleryTriggers.forEach(item => {
      item.addEventListener("click", event => {
        if (item.matches(".feature-card")) {
          event.preventDefault();
          activeGalleryItems = [...galleryTriggers].filter(galleryItem => galleryItem.matches(".feature-card"));
        } else if (item.matches(".photo-frame")) {
          activeGalleryItems = [
            item,
            ...[...galleryTriggers].filter(galleryItem => galleryItem.matches(".feature-card"))
          ];
        } else {
          activeGalleryItems = [...galleryItems].filter(galleryItem => !galleryItem.hidden);
        }
        currentImageIndex = activeGalleryItems.indexOf(item);
        showImage(currentImageIndex);
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    document.querySelectorAll(".photo-frame[data-full]").forEach(item => {
      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          item.click();
        }
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => {
      showImage(currentImageIndex - 1);
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
      showImage(currentImageIndex + 1);
    });
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", event => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
      if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
    });
  }

  // Lời nhắn: lưu cục bộ trong trình duyệt này.
  const form = document.querySelector("#messageForm");
  const messageList = document.querySelector("#messageList");
  const storageKey = "ky-niem-12a8-messages";
  const readMessages = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };
  const renderMessages = () => {
    if (!messageList) return;
    const messages = readMessages();
    messageList.replaceChildren();
    if (!messages.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Chưa có lời nhắn nào. Hãy là người đầu tiên nhé!";
      messageList.append(empty);
      return;
    }
    messages.slice().reverse().forEach(message => {
      const card = document.createElement("article");
      card.className = "note-card";
      const author = document.createElement("strong");
      author.textContent = message.name;
      const content = document.createElement("p");
      content.textContent = message.text; // textContent giúp hiển thị an toàn, không chạy HTML người nhập.
      const date = document.createElement("small");
      date.textContent = message.date;
      card.append(author, content, date);
      messageList.append(card);
    });
  };
  const textArea = document.querySelector("#messageText");
  const charCount = document.querySelector("#charCount");
  if (textArea && charCount) {
    textArea.addEventListener("input", () => {
      charCount.textContent = `${textArea.value.length}/500 ký tự`;
    });
  }
  if (form) {
    renderMessages();
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.querySelector("#senderName").value.trim();
      const text = textArea.value.trim();
      const feedback = document.querySelector("#formFeedback");
      if (!name || !text) return;
      const messages = readMessages();
      messages.push({ name, text, date: new Date().toLocaleString("vi-VN") });
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
        form.reset();
        charCount.textContent = "0/500 ký tự";
        feedback.textContent = "Đã lưu lời nhắn trên trình duyệt này. Cảm ơn bạn! ♡";
        renderMessages();
      } catch {
        feedback.textContent = "Trình duyệt không cho phép lưu dữ liệu. Hãy thử mở bằng Chrome.";
      }
    });
  }
  const clearButton = document.querySelector("#clearMessages");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa toàn bộ lời nhắn đã lưu trên trình duyệt này?")) {
        localStorage.removeItem(storageKey);
        renderMessages();
        const feedback = document.querySelector("#formFeedback");
        if (feedback) feedback.textContent = "Đã xóa lời nhắn trên thiết bị này.";
      }
    });
  }
});
