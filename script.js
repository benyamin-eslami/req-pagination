const formElem = document.querySelector("form");
const container = document.querySelector(".container");
const selectElem = document.querySelector("select");
let dividedElem = [];
let postedData = [];
function sendReq(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.send();
  });
}
async function showGetResponse() {
  let returnedPromise = await sendReq("GET", "https://reqres.in/api/users");
  let obj = await JSON.parse(returnedPromise);
  obj.data.forEach((data) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="person-container">
      <p id="first-name">${data.first_name}</p>
      <p id="last-name">${data.last_name}</p>
      <p id="email">${data.email}</p>
      <img id="avatar" src=${data.avatar} />
      </div>
      `
    );
  });
}

async function returnGetResponseDatas() {
  let returnedPromise = await sendReq("GET", "https://reqres.in/api/users");
  let obj = await JSON.parse(returnedPromise);
  let datas = await obj.data;
  return datas;
}

async function postReq(event) {
  event.preventDefault();
  let firstName = document.querySelector("#firstname").value;
  let lastName = document.querySelector("#lastname").value;
  let email = document.querySelector("#email").value;
  let avatar = document.querySelector("#srcImg").value;
  if (firstName && lastName && email && avatar) {
    postedData.push({
      first_name: firstName,
      last_name: lastName,
      email: email,
      avatar: avatar,
    });
    try {
      let resp = await axios.post("https://reqres.in/api/users", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar: avatar,
      });
      container.insertAdjacentHTML(
        "afterbegin",
        `
    <div class="person-container">
    <p id="first-name">${resp.data.firstName}</p>
      <p id="last-name">${resp.data.lastName}</p>
      <p id="email">${resp.data.email}</p>
      <img id="avatar" src=${resp.data.avatar} />
      </div>
    `
      );
      createPaginationBtns();
    } catch (error) {
      console.log("error catched :", error);
    }
  } else {
    alert("one of the input is undifinded");
  }
}

async function createPaginationBtns() {
  const selectValue = +selectElem.value;
  let dividedElem = [];

  let datas = await returnGetResponseDatas();
  const ulElem = document.querySelector(".pagination-container");
  console.log(postedData);
  if (postedData.length !== 0) {
    postedData.forEach((data) => {
      data.id = datas.length + 1;
      datas.unshift(data);
    });
  }

  for (let i = 0; i < datas.length; i += selectValue) {
    dividedElem.push(datas.slice(i, i + selectValue));
  }
  container.innerHTML = "";
  contentLoader(1, dividedElem);
  let pageNumber, liElem;
  ulElem.innerHTML = "";
  dividedElem.forEach((chunk, i) => {
    pageNumber = document.createElement("button");
    pageNumber.innerHTML = i + 1;
    liElem = document.createElement("li");
    liElem.append(pageNumber);
    ulElem.append(liElem);
  });

  const btns = document.querySelectorAll("button");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showPageNumberContent(e, dividedElem);
    });
  });
}

showGetResponse();

function showPageNumberContent(e, dividedElem) {
  container.innerHTML = "";
  const pageNumber = +e.target.innerHTML;
  contentLoader(pageNumber, dividedElem);
}
function contentLoader(number, dividedElem) {
  dividedElem[number - 1].forEach((obj, i) => {
    container.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="person-container">
    <p id="first-name">${obj.first_name}</p>
      <p id="last-name">${obj.last_name}</p>
      <p id="email">${obj.email}</p>
      <img id="avatar" src=${obj.avatar} />
      </div>
    `
    );
  });
}

selectElem.addEventListener("change", createPaginationBtns);
formElem.addEventListener("submit", postReq);
createPaginationBtns(postedData);
