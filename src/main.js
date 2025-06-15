import './style.css';
import { format } from 'date-fns';

const API_URL = 'https://lqxbwwuaxbcwwkuehwxv.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGJ3d3VheGJjd3drdWVod3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODkwMDUsImV4cCI6MjA2NDI2NTAwNX0.SV446WM4wIZkQ4vUGaCOSACXpsAYCes-QeyhLIChJ6w';


document.querySelector('#app').innerHTML = `
  <div id="article-list" class="m-4"></div>

  <label class="block m-3">
    <select id="sort-select" class="border p-2">
      <option value="created_at.asc">data rosnąco</option>
      <option value="created_at.desc">data malejąco</option>
      <option value="title.asc">nazwa alfabetycznie</option>
    </select>
  </label>

  <h2 class="text-xl m-3">Dodaj nowy</h2>

  <form id="article-form">

    <input name="title" placeholder="title" required class="w-full border p-2" />
    <input name="subtitle" placeholder="subtitle" required class="w-full border p-2" />
    <input name="author" placeholder="author" required class="w-full border p-2" />
    <input type="date" name="created_at" required class="w-full border p-2" />

    <div>
    <textarea name="content" placeholder="tu pisz"></textarea>
    </div>

    <button type="submit" class="bg-blue-200 px-4 py-2">Dodaj</button>
  </form>
`;

const fetchArticles = async (orderBy = 'created_at.desc') => {
  try {
    const response = await fetch(`${API_URL}?order=${orderBy}`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const createNewArticle = async (article) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(article)
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};



const renderArticles = async () => {
  const order = document.getElementById('sort-select')?.value || 'created_at.desc';
  const articles = await fetchArticles(order);
  const container = document.getElementById('article-list');
  container.innerHTML = '';

  articles.forEach((a) => {
    const div = document.createElement('div');
    div.className = 'border p-4';
    div.innerHTML = `
      <h2 class="text-xl font-semibold">${a.title}</h2>
      <h3 class="italic text-gray-600">${a.subtitle}</h3>
      <p class="text-sm text-gray-500">${a.author} – ${format(new Date(a.created_at), 'dd-MM-yyyy')}</p>
      <div class="mt-2">${a.content}</div>
    `;
    container.appendChild(div);
  });
};
document.getElementById('sort-select').addEventListener('change', renderArticles);

document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const article = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value
  };
  await createNewArticle(article);
  form.reset();
  renderArticles();
});

renderArticles();