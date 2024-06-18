const btn = document.getElementById('button');
const docStatsBtn = document.getElementById('docStats');
const termStatsBtn = document.getElementById('termStats');

const mainTable = document.getElementById('main-table');
const results = document.getElementById('results');
const pages = document.getElementById('pages');
const statsDiv = document.getElementById('statsDiv');
const termStatsDiv = document.getElementById('termStatsDiv');

docStatsBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const response = await fetch('http://localhost:8080/docStats');
  const data = await response.json();

  statsDiv.innerHTML = '';
  let p = createP('Eγγαφα στο ευρετήριο', data.Documents);
  statsDiv.appendChild(p);
});

termStatsBtn.addEventListener('click', async (e) => {
  termStatsDiv.innerHTML = '';
  e.preventDefault();
  const response = await fetch('http://localhost:8080/termStats');
  const data = await response.json();

  data.sort((a, b) => b.frequency - a.frequency);
  let pp = document.createElement('p');
  pp.textContent = 'Κορυφαίοι σε εμφανίσεις όροι';
  termStatsDiv.appendChild(pp);

  for (let i = 0; i < 5; i++) {
    let p = document.createElement('p');
    p.textContent = `${data[i].term} : ${data[i].frequency}`;
    termStatsDiv.appendChild(p);
  }
});

btn.addEventListener('click', async (e) => {
  e.preventDefault();
  const que = document.getElementById('query').value;
  const field = document.getElementById('field').value;
  const sort = document.getElementById('sort').value;

  const response = await fetch(
    `http://localhost:8080/query?que=${que}&field=${field}&sort=${sort}`
  );

  let data = await response.json();
  mainTable.innerHTML = '';
  results.textContent = `${data.length} Results Found`;
  pages.textContent = `${Math.ceil(data.length / 10.0)} Pages`;
  console.log(data);
  const totalRows = 10;
  const totalPages = Math.ceil(data.length / totalRows);

  let currentPage = 0;

  // backup node for next update
  let lastTable = null;

  function arrayToTable(arr, page) {
    const start = page * totalRows;
    const arrTable = arr.slice(start, start + totalRows);

    const table = document.createElement('table'); // <table></table>

    arrTable.forEach(function (result) {
      const trs = document.createElement('tr'); // <tr></tr>
      const td1 = document.createElement('td'); // <td></td>
      const text1 = document.createTextNode(result.score);
      td1.appendChild(text1); // <td>{text1}</td>
      trs.appendChild(td1); // <tr><td>{text1}</td></tr>

      const td2 = document.createElement('td'); // <tr></tr>
      td2.innerHTML += result.contents; // <td>{text2}</td>
      trs.appendChild(td2);
      // <tr>
      //     <td>{text1}</td>
      //     <td>{text2}</td>
      // </tr>

      const td3 = document.createElement('td'); // <tr></tr>
      const text3 = document.createTextNode(result.path);
      td3.appendChild(text3); // <td>{text2}</td>
      trs.appendChild(td3);

      table.appendChild(trs);
    });

    // update old node with new node if old node exists
    if (lastTable) mainTable.replaceChild(table, lastTable);
    // else add new node
    else mainTable.appendChild(table);

    // backup last node
    lastTable = table;
  }

  function previousPage(event) {
    event.preventDefault();
    currentPage = currentPage === 0 ? currentPage : currentPage - 1;
    arrayToTable(data, currentPage);

    document.getElementById('page-no').innerText = currentPage + 1;
  }

  function nextPage(event) {
    event.preventDefault();
    currentPage =
      currentPage === totalPages - 1 ? currentPage : currentPage + 1;
    arrayToTable(data, currentPage);

    document.getElementById('page-no').innerText = `${currentPage + 1} out of`;
  }

  const previous = document.getElementById('previous');
  const next = document.getElementById('next');

  previous.addEventListener('click', previousPage, false);
  next.addEventListener('click', nextPage, false);

  arrayToTable(data, currentPage);
});

const createP = (name, num) => {
  let p = document.createElement('p');
  p.textContent = `${name} : ${num}`;

  return p;
};
