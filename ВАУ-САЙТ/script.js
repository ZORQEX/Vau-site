
const starContainer = document.getElementById('starContainer');
const ratingResult = document.getElementById('ratingResult');
const MAX_STARS = 5;
let userRating = 0;

const commentInput = document.getElementById('commentInput');
const submitCommentBtn = document.getElementById('submitComment');
const commentsContainer = document.getElementById('commentsContainer');

const contactForm = document.getElementById('contactForm');
const contactStatus = document.createElement('div');
contactStatus.id = 'contactStatus';
contactForm.appendChild(contactStatus);

const savedRating = localStorage.getItem('siteRating');
if (savedRating !== null) {
    userRating = parseInt(savedRating, 10);
}

const savedComments = localStorage.getItem('siteComments');
let comments = savedComments ? JSON.parse(savedComments) : [];

const savedMessages = localStorage.getItem('siteMessages');
let contactMessages = savedMessages ? JSON.parse(savedMessages) : [];

function renderStars() {
    starContainer.innerHTML = '';
    for (let i = 1; i <= MAX_STARS; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.textContent = '★';
        if (i <= userRating) {
            star.classList.add('active');
        } else {
            star.classList.add('empty');
        }
        star.addEventListener('click', () => {
            userRating = i;
            localStorage.setItem('siteRating', userRating);
            renderStars();
            ratingResult.textContent = `Ваша оценка: ${userRating} из ${MAX_STARS}`;
        });
        star.addEventListener('mouseover', () => {
            for (let j = 0; j < MAX_STARS; j++) {
                const s = starContainer.children[j];
                if (s) {
                    s.classList.toggle('active', j < i);
                    s.classList.toggle('empty', !(j < i));
                }
            }
        });
        starContainer.appendChild(star);
    }
    
    ratingResult.textContent = `Ваша оценка: ${userRating} из ${MAX_STARS}`;
}

function renderComments() {
    commentsContainer.innerHTML = '';
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>Пока нет комментариев.</p>';
        return;
    }
    comments.forEach((comment, index) => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment-item');
        commentDiv.innerHTML = `
            <div class="rating">Оценка: ${comment.rating} из ${MAX_STARS}</div>
            <div class="text">${escapeHtml(comment.text)}</div>
            <div class="date">${new Date(comment.timestamp).toLocaleString()}</div>
        `;
        commentsContainer.appendChild(commentDiv);
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}


submitCommentBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (text === '') {
        alert('Пожалуйста, напишите комментарий.');
        return;
    }
    if (userRating === 0) {
        alert('Пожалуйста, сначала поставьте оценку.');
        return;
    }
    const newComment = {
        rating: userRating,
        text: text,
        timestamp: Date.now()
    };
    comments.push(newComment);
    localStorage.setItem('siteComments', JSON.stringify(comments));
    commentInput.value = '';
    renderComments();
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[placeholder="Ваше имя"]').value.trim();
    const email = this.querySelector('input[placeholder="Ваш email"]').value.trim();
    const message = this.querySelector('textarea').value.trim();
    if (name === '' || email === '' || message === '') {
        contactStatus.textContent = 'Пожалуйста, заполните все поля.';
        contactStatus.style.color = '#ff6b6b';
        return;
    }
    const newMessage = {
        name: name,
        email: email,
        message: message,
        timestamp: Date.now()
    };
    contactMessages.push(newMessage);
    localStorage.setItem('siteMessages', JSON.stringify(contactMessages));
    contactStatus.textContent = 'Спасибо! Ваше сообщение отправлено.';
    contactStatus.style.color = '#4caf50';
    this.reset();
    console.log('Saved contact messages:', contactMessages);
});

renderStars();
renderComments();