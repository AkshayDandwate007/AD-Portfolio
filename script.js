// =================== CONFIG ===================
const TURN_DURATION = 820; // ms, must match CSS transition
let isAnimating = false;

// =================== ELEMENTS ===================
const pageTurnBtn = document.querySelectorAll(".nextprev-btn");
const pagesNodeList = document.querySelectorAll(".book-page.page-right");
const pages = Array.from(pagesNodeList); // make array for easier index lookup
const coverRight = document.querySelector(".cover.cover-right");

// ----------------- store original index for each page -----------------
pages.forEach((p, i) => {
  p.dataset.origIndex = i;             // remember original order
  // set an initial sensible stacking so pages are layered correctly by default
  p.style.zIndex = pages.length - i;
});

// =================== PAGE TURN LOGIC ===================
pageTurnBtn.forEach((btn) => {
  btn.onclick = () => {
    if (isAnimating) return;
    isAnimating = true;

    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
      handleMobileNavigation(btn);
      setTimeout(() => (isAnimating = false), 400);
      return;
    }

    const pageTurnId = btn.getAttribute("data-page");
    const pageTurn = document.getElementById(pageTurnId);

    if (!pageTurn) {
      isAnimating = false;
      return;
    }

    // get the page's original index (fallback to computed index if not set)
    const origIndex = Number(pageTurn.dataset.origIndex ?? pages.indexOf(pageTurn));

    if (btn.classList.contains("back")) {
      // ---- BACK ----
      pageTurn.classList.remove("turn");

      // after half the animation duration, restore it to its original stack position
      setTimeout(() => {
        // restore below the flipped pages: keep original stacking
        pageTurn.style.zIndex = pages.length - origIndex;
      }, TURN_DURATION / 2);
    } else {
      // ---- NEXT ----
      pageTurn.classList.add("turn");

      // bring it above others so it visually flips on top
      setTimeout(() => {
        pageTurn.style.zIndex = pages.length + origIndex; // push above stack
      }, TURN_DURATION / 2);
    }

    setTimeout(() => (isAnimating = false), TURN_DURATION);
  };
});

// =================== MOBILE NAVIGATION FUNCTION ===================
function handleMobileNavigation(btn) {
  const pageTurnId = btn.getAttribute("data-page");
  const allPageIds = ["page-left", "turn-1", "turn-2", "turn-3"];
  const currentIndex = allPageIds.indexOf(pageTurnId);

  if (btn.classList.contains("back")) {
    if (currentIndex > 0) {
      const prevPageId = allPageIds[currentIndex - 1];
      const prevPage = document.getElementById(prevPageId);
      if (prevPage) {
        scrollToPage(prevPage);
      }
    }
  } else {
    if (currentIndex < allPageIds.length - 1) {
      const nextPageId = allPageIds[currentIndex + 1];
      const nextPage = document.getElementById(nextPageId);
      if (nextPage) {
        scrollToPage(nextPage);
      }
    }
  }

  if (pageTurnId === "turn-1" || pageTurnId === "turn-3") {
    const container = document.querySelector(`#${pageTurnId} .wrd-container`);
    if (container) {
      container.style.overflowY = "auto";
      container.style.scrollSnapType = "y mandatory";
      container.style.maxHeight = "400px";
      container.style.scrollbarWidth = "thin";
      container.style.msOverflowStyle = "auto";
      container.classList.add("custom-scrollbar");
    }
  }
}

// =================== SCROLL TO PAGE FUNCTION ===================
function scrollToPage(targetElement) {
  if (!targetElement) return;
  const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: elementPosition - 20,
    behavior: "smooth",
  });
}

// =================== CONTACT PAGE NEXT REMOVE ===================
const contactPage = document.querySelector("#contact");
if (contactPage) {
  const contactNext = contactPage.querySelector(".nextprev-btn:not(.back)");
  if (contactNext) contactNext.remove();
}

// =================== CONTACT ME button (flip sequentially) ===================
const contactMeBtn = document.querySelector(".btn.contact-me");
if (contactMeBtn) {
  contactMeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (isAnimating) return;
    isAnimating = true;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const contactPage = document.getElementById("turn-3");
      if (contactPage) {
        scrollToPage(contactPage);
        setTimeout(() => (isAnimating = false), 400);
      }
    } else {
      pages.forEach((page, index) => {
        if (index < pages.length - 1) {
          setTimeout(() => {
            page.classList.add("turn");
            page.style.zIndex = 20 + index;
          }, (index + 1) * 200 + 100);
        }
      });
      setTimeout(() => (isAnimating = false), pages.length * 200 + 600);
    }
  });
}

// =================== BACK PROFILE button (reset all) ===================
const backProfileBtn = document.querySelector(".back-profile");
if (backProfileBtn) {
  backProfileBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    pages.forEach((page) => {
      page.classList.remove("turn");
      const oi = Number(page.dataset.origIndex ?? pages.indexOf(page));
      page.style.zIndex = pages.length - oi; // restore original stacking
    });

    if (introSection) {
      introSection.style.display = "flex";
    }

    setTimeout(() => (isAnimating = false), TURN_DURATION + 200);
  });
}

// =================== OPENING ANIMATION ===================
if (coverRight) {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    setTimeout(() => coverRight.classList.add("turn"), 2100);
    setTimeout(() => (coverRight.style.zIndex = -1), 2800);
  } else {
    coverRight.style.display = "none";
  }
}

// initial reset (use origIndex to set safe z-index for opening)
pages.forEach((page, index) => {
  const oi = Number(page.dataset.origIndex ?? index);
  setTimeout(() => {
    page.classList.remove("turn");
    // keep initial stacking high so they appear in order
    page.style.zIndex = 50 + oi;
  }, (index + 1) * 300 + 2100);
});

// =================== OPEN PORTFOLIO BUTTON ===================
const openPortfolioBtn = document.querySelector(".open-btn");
const introSection = document.querySelector(".intro-section");
if (openPortfolioBtn) {
  openPortfolioBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    pages.forEach((page, index) => {
      setTimeout(() => {
        page.classList.remove("turn");
        const oi = Number(page.dataset.origIndex ?? index);
        page.style.zIndex = pages.length - oi; // restore stack using original index
      }, index * 300);
    });

    if (introSection) {
      introSection.style.display = "none";
    }

    setTimeout(() => (isAnimating = false), pages.length * 300 + 500);
  });
}

// =================== DOWNLOAD CV BUTTON ===================
const downloadCvBtn = document.querySelector("a.btn[download]");
if (downloadCvBtn) {
  downloadCvBtn.addEventListener("click", (e) => {
    const href = downloadCvBtn.getAttribute("href");
    if (!href) {
      e.preventDefault();
      alert("CV file not found.");
    }
  });
}

// =================== NEURAL NETWORK BACKGROUND ===================
const canvas = document.getElementById("network-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  let nodes = [];
  function createNodes() {
    nodes = [];
    let count = window.innerWidth <= 1024 ? 20 : 50;
    let radius = window.innerWidth <= 1024 ? 4 : 2;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: radius,
      });
    }
  }
  createNodes();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      ctx.shadowColor = "#00d4ff";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00d4ff";
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dist = Math.hypot(n.x - m.x, n.y - m.y);
        if (dist < 120) {
          ctx.shadowColor = "#c896ff";
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(200, 150, 255, ${1 - dist / 120})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createNodes();
  });
}

// =================== TYPING EFFECT ===================
const typingText = "Feel free to connect with me on LinkedIn or via email!";
const typingElement = document.getElementById("typing-text");
let index = 0;

function type() {
  if (!typingElement) return;
  if (index < typingText.length) {
    typingElement.innerHTML += typingText.charAt(index);
    index++;
    setTimeout(type, 50);
  }
}
setTimeout(type, 1000);

// =================== SCROLL FADE-IN EFFECT FOR MOBILE ===================
if (window.innerWidth <= 1024) {
  console.log("Mobile view detected: initializing scroll fade-in and progress bar");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });

  document.querySelectorAll('.wrd-container, .portfolio-box').forEach(el => {
    console.log("Processing element for fade-in and progress bar:", el);
    el.classList.add('fade-in-mobile');
    observer.observe(el);

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.display = 'block'; 
    el.appendChild(progressBar);

    el.addEventListener('scroll', () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;

      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
    });
  });
}


// home icon page no 6 - Navigate back to first page
document.querySelectorAll(".homee-btn").forEach(btn => {
  btn.onclick = () => {
    if (isAnimating) return;
    isAnimating = true;

    // Remove turn class from all pages to go back to first page
    pages.forEach((page) => {
      page.classList.remove("turn");
      const oi = Number(page.dataset.origIndex ?? pages.indexOf(page));
      page.style.zIndex = pages.length - oi; // restore original stacking
    });

    setTimeout(() => (isAnimating = false), TURN_DURATION);
  };
});


// All cards select करा
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('touchstart', () => {
    card.classList.add('active');
  });
  card.addEventListener('touchend', () => {
    setTimeout(() => card.classList.remove('active'), 300);
  });
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.card').forEach(card => observer.observe(card));


//  <!-- Preloader Script -->
        
          window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            const mainContent = document.getElementById('main-content');
            setTimeout(() => {
              preloader.style.display = 'none';
              mainContent.style.display = 'block';
            }, 4000); // Increased to 5 seconds for slower loading
          });
        

          document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.wrd-container');
            if (!container) return;

            container.addEventListener('wheel', function (e) {
              const delta = e.deltaY;
              const atTop = container.scrollTop === 0;
              const atBottom = container.scrollHeight - container.clientHeight === container.scrollTop;

              if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
                e.preventDefault();
              } else {
                e.stopPropagation();
              }
            }, { passive: false });
          });
       

            document.addEventListener("DOMContentLoaded", () => {
            const typingBox = document.getElementById("typing-text");
            const fullText = "✨ Best regards,\nAkshay Dandwate";

            let i = 0;
            function typeWriter() {
              if (i < fullText.length) {
                typingBox.innerHTML += fullText[i] === "\n" ? "<br/>" : fullText[i];
                i++;
                setTimeout(typeWriter, 45);
              }
            }

            // Observe when Thank You page opens
            const observer = new MutationObserver(() => {
              const thankYouPage = document.querySelector("#turn-4.page-right");
              if (
                thankYouPage &&
                thankYouPage.classList.contains("turn") &&
                typingBox.innerHTML.trim() === ""
              ) {
                typeWriter();
              }
            });

            observer.observe(document.querySelector(".book"), {
              attributes: true,
              subtree: true,
            });
          });
        


    
       
         

  (function () {
    emailjs.init("_G5a"); // 
  })();

  document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this).then(
      () => {
        this.reset(); // 
      },
      (err) => {
        document.getElementById("error-popup").style.display = "flex"; // ❌ Error popup दाखव
      }
    );
  });


          function openBook() {
            const intro = document.getElementById("intro");
            const wrapper = document.getElementById("book-wrapper");
            const rightCover = document.querySelector(".cover.cover-right");

            intro.classList.add("hidden");
            setTimeout(() => {
              intro.style.display = "none";
              wrapper.style.display = "block";
              setTimeout(() => {
                rightCover.classList.add("turn");
              }, 200);
            }, 600);
          }

          function showPortfolio() {
            const intro = document.getElementById("intro");
            const portfolioContent = document.getElementById("portfolio-content");
            const wrapper = document.getElementById("book-wrapper");

            intro.style.display = "none";
            wrapper.style.display = "none";
            portfolioContent.style.display = "block";
          }
    //  rested key copy the code 
    document.addEventListener('keydown', function(e){
    if(e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C' || e.key === 'i' || e.key === 'I')){
        e.preventDefault();
        alert("This action is disabled!");
    }
});







const aiBot = document.getElementById("aiBot");
const aiChat = document.getElementById("aiChat");
const chatClose = document.getElementById("chatClose");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const messagesEl = document.getElementById('messages');

// Toggle chat on bot click
aiBot.addEventListener('click', (e) => {
  e.stopPropagation();
  if (aiChat.style.display === 'none' || aiChat.style.display === '') {
    aiChat.style.display = 'flex';
    appendMessage("Hi — I'm Akshay's assistant! Ask me about skills, projects, education, experience, or type 'contact' to get email/LinkedIn/resume.", 'bot');
  } else {
    aiChat.style.display = 'none';
  }
});

// Close chat on [✕]
chatClose.addEventListener('click', () => {
  aiChat.style.display = 'none';
});

// Optional: closes chat when clicking outside
document.addEventListener('click', function(event) {
  if (!aiBot.contains(event.target) && !aiChat.contains(event.target)) {
    aiChat.style.display = 'none';
  }
});

// Send message logic
sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (!text) return;
  userInput.value = '';
  botRespond(text);
});

// Enter key support
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendBtn.click();
  }
});

// Append message to chat
function appendMessage(text, who = 'bot', options = { html: false }) {
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  if (options.html) div.innerHTML = text;
  else div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Bot response logic
function botRespond(userText) {
  appendMessage(userText, 'user');
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const q = userText.toLowerCase();

    // Contact buttons
    if(q.includes("contact") || q.includes("info")) {
      const contactHtml = `
        <div>Here is how you can reach Akshay:</div>
        <div style="margin-top:8px;">
          <a href="mailto:akshay.dandwate007@gmail.com" target="_blank" style="
              display:inline-block;
              margin:2px;
              padding:5px 10px;
              background-color:#4CAF50;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:14px;
          ">Email</a>

          <a href="www.linkedin.com/in/akshay-dandvate-446485291/" target="_blank" style="
              display:inline-block;
              margin:2px;
              padding:5px 10px;
              background-color:#0077B5;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:14px;
          ">LinkedIn</a>

          <a href="/resumepdf/AkshayDandvate.pdf" target="_blank" style="
              display:inline-block;
              margin:2px;
              padding:5px 10px;
              background-color:#f39c12;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:14px;
          ">Download Resume</a>
        </div>
      `;
      appendMessage(contactHtml, 'bot', { html: true });
      return;
    }

    // Simple answer logic
    let answer;
    if(q.includes("skill")) 
        answer = "Java, Spring Boot, ReactJS, MySQL, HTML, CSS, Docker, GitHub, AWS.";
    else if(q.includes("project")) 
        answer = "Gym Management (ASP.NET), Dental Hospital App (ReactJS/MySQL), Student Attendance Management (PHP/MySQL).";
    else if(q.includes("education") || q.includes("college")) 
        answer = "B.E. Computer Engineering, Guru Gobind Singh College, Nashik, 2020–2024.";
    else if(q.includes("experience") || q.includes("intern")) 
        answer = "Intern at Paarsh Infotech & OctaNet Software Services.";
    else if(q.includes("certif") || q.includes("course") || q.includes("ccna") || q.includes("aws")) 
        answer = "Java Full Stack, Cybersecurity Analyst, AWS ML Foundations, CCNA Intro to Networks.";
    else if(q.includes("name")) 
        answer = "Akshay Dandwate";
    else 
        answer = "I'm Akshay's bot. You can ask about my skills, projects, education, experience, or type 'contact' to see Email/ LinkedIn/ Resume Link.";

    appendMessage(answer, 'bot', { html: true });
  }, 900);
}
