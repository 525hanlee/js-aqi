const selectCity = document.querySelector('.selectCity');
const listLocation = document.querySelector('.listLocation');
let data = '';
const getData = (n) => {
  const proxy = 'https://script.google.com/macros/s/AKfycby6bUHQkwhWPYkdpAcp4IxIdT7rG87fTr6cN6sdkA/exec?url=';
  const url = 'http://opendata2.epa.gov.tw/AQI.json';
  fetch(proxy+url)
    .then(response => {
      return response.ok ? response.json() : Promise.reject(new Error('エラーです！'));
    })
    .then(json => {
      data = json;
      addToOption();
      createCard('臺北市');
      console.log(data);
    })
    .catch(e => {
      console.log(e.message);
      if (n > 1) {
        return getData(n - 1);
      } // エラーです！
    });
};
const addToOption = () => {
  var str = '';
  var zone = [];
  str += '<option disabled>請選擇地區</option>';
  for(var i = 0;i < data.length; i++){
    if(zone.indexOf(data[i].County) == -1){
      zone.push(data[i].County);
      str += '<option>'+data[i].County+'</option>';
    }
  }
  selectCity.innerHTML = str;
};
const getColor = (num) => {
  if (num <= 50) {
    return 'color-01';
  }else if (num >= 51 && num <= 100) {
    return 'color-02';
  }else if (num >= 101 && num <= 150) {
    return 'color-03';
  }else if (num >= 151 && num <= 200) {
    return 'color-04';
  }else if (num >= 201 && num <= 300) {
    return 'color-05';
  }else if (num >= 301 && num <= 400) {
    return 'color-06';
  }
};
const createCard = (city) =>{
  let str = '';
  let a = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].County === city) {
      if (a === 0) {
        changeCity(i);
        showData(i);
        a = 1;
      }
      let aqi = data[i].AQI;
      if (aqi == '') { aqi = 'null'; }
      str += `
      <div class="card" data-num="${i}">
        <div class="location">${data[i].SiteName}</div>
        <div class="aqi color-01 ${getColor(data[i].AQI)}">${aqi}</div>
      </div>
      `;
    }
  }
  listLocation.innerHTML = str;
};
const showData = (num) => {
  let dataList = data[num];
  const location = document.querySelector('.selectLocation .location');
  const aqi = document.querySelector('.selectLocation .aqi');
  const listNum = document.querySelectorAll('.allAqi-list-num');
  const cf = ['O3','PM10','PM2.5','CO','SO2','NO2'];
  if (dataList.AQI == '') { dataList.AQI = 'null'; }
  location.textContent = dataList.SiteName;
  aqi.textContent = dataList.AQI;
  aqi.classList = 'aqi '+getColor(dataList.AQI);
  for (var i = 0; i < listNum.length; i++) {
    if (dataList[cf[i]] == '') { dataList[cf[i]] = 'null'; }
    listNum[i].textContent = dataList[cf[i]];
  }
};
const changeCity = (i) => {
  document.querySelector('.city').textContent = data[i].County;
  document.querySelector('.updateTime').textContent = data[i].PublishTime+' 更新';
};
getData(5);
selectCity.addEventListener('change',function(e){createCard(e.target.value);});
listLocation.addEventListener('click',function(e){
  const card = e.target.parentElement;
  if (card.className === 'card') {
    showData(card.dataset.num);
  }
});
