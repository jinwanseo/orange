//공사 추가 버튼 클릭시
document.querySelector(".add-btn").addEventListener("click", (e) => {
  if (document.querySelectorAll(".work--item").length > 23) {
    alert("공사를 더이상 추가할수 없음 [23 항목까지 가능]");
    return;
  }
  
  if (document.querySelector('.work-to').value === ''){
    alert("수신인 먼저 입력 해주세요");
    document.querySelector('.work-to').focus();
    return;
  }
  if(document.querySelector('.work-date').value === ''){
    alert("공사 예정일을 선택 해주세요");
    return;
  }

  //공사 테이블 생성 및 추가
  const newWorkTable = document.createElement('table');
  newWorkTable.classList.add('work--item');
  newWorkTable.innerHTML = addWorkRowHTML();
  document.querySelector(".work--area").append(newWorkTable);
});

//공사 삭제 버튼 클릭시
document.querySelector(".sub-btn").addEventListener("click", (e) => {
  const works = document.querySelectorAll(".work--item");
  if (works.length <= 0) return;
  works[works.length - 1].remove();
  changeTotalPriceState();
});

//금액 입력시 
document.querySelector('.work--area').addEventListener('change',e=>{
    if(e.target.classList.contains('work-price')){
        changeTotalPriceState();
    }
})

//엑셀 저장 버튼 클릭시
document
  .querySelector('.work--save input[type="button"]')
  .addEventListener("click", (e) => {
    const workInfo = getWorkData();
    const tableHTML = getWorkTableHTML(workInfo);
    document.querySelector("#tblExport").innerHTML = tableHTML;
    document.querySelector('#btnExport').classList.add('active');
  });

//공사 추가
const addWorkRowHTML = ()=>{
   return `
   <tbody>
       <tr>
           <td><label>공 사 명</label></td>
           <td>
               <input type="text" class="work-name"/>
           </td>
       </tr>
       <tr>
           <td><label>산출근거 및 규격</label></td>
           <td>
               <input type="text" class="work-standard"/>
           </td>
       </tr>
       <tr>
           <td><label>수 량</label></td>
           <td>
               <input type="number" class="work-cnt"/>
           </td>
       </tr>
       <tr>
           <td><label>단 위</label></td>
           <td>
               <input type="text" class="work-unit"/>
           </td>
       </tr>
       <tr>
           <td><label>단 가</label></td>
           <td>
               <input type="number" class="work-cost"/>
           </td>
       </tr>
       <tr>
           <td><label>금 액</label></td>
           <td>
               <input type="number" class="work-price" value="0"/>
           </td>
       </tr>
       <tr>
           <td><label>비 고</label></td>
           <td>
               <input type="text" class="work-etc"/>
           </td>
       </tr>
   </tbody>
   `;
}

//견적서 입력 내용
const getWorkData = ()=>{
    //값저장
    const [year, month, day] = document.querySelector(".work-date").value.split('-');
    const works = [];
    document.querySelectorAll(".work--item").forEach((item) =>
      works.push({
        workName: item.querySelector(".work-name").value,
        workStandard: item.querySelector(".work-standard").value,
        workCount: item.querySelector(".work-cnt").value,
        workUnit: item.querySelector(".work-unit").value,
        workCost: item.querySelector(".work-cost").value,
        workPrice: item.querySelector(".work-price").value,
        workEtc: item.querySelector(".work-etc").value,
      })
    );

    return {
        workTo : document.querySelector(".work-to").value,
        workDate : {year, month, day},
        nowDate : `${itoStr(new Date().getFullYear())}-${itoStr(new Date().getMonth()+1)}-${itoStr(new Date().getDate())}`,
        works : works,
        totalPrice : document.querySelector(".work-totalprice").value,
    };
}

//견적서 내용 HTML GET
const getWorkTableHTML = (workInfo)=>{
    //공사 테이블 UI
    let workListStr = ""; //공사 테이블
    const totalPrice = (Number(document.querySelector('.work-totalprice').value) * 1.1).toLocaleString();
    for (let i = 0; i < 23; i++) {
      if (workInfo.works[i] !== undefined) {
        workListStr += `
            <tr>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${workInfo.works[i].workName}</td>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${workInfo.works[i].workStandard}</td>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${Number(workInfo.works[i].workCount).toLocaleString()}</td>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${workInfo.works[i].workUnit}</td>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${Number(workInfo.works[i].workCount).toLocaleString()}</td>
                <td colspan="2" style="border:0.5px solid lightgrey;text-align:right;">${'₩' + Number(workInfo.works[i].workPrice).toLocaleString()}</td>
                <td colspan="1" style="border:0.5px solid lightgrey;text-align:center;">${workInfo.works[i].workEtc}</td>
            </tr>
            `;
      } else {
        workListStr += `
            <tr>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
                <td colspan="2" style="border:0.5px solid lightgrey;"></td>
                <td colspan="1" style="border:0.5px solid lightgrey;"></td>
            </tr>
            `;
      }
    }

    return `
    <thead>
        <tr>
            <th colspan="8" style="font-weight: bolder;text-decoration: underline;font-size : 24px;text-align:center;">견 적 서</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;">No.${workInfo.nowDate}</td>
            <td colspan="4" style="border:0.5px solid lightgrey;font-weight: bold;text-align: center;">${workInfo.workDate.year}년 ${workInfo.workDate.month}월 ${workInfo.workDate.day}일</td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">등 록 번 호 : 208-23-68205</td>
        </tr>
        <tr>
            <td colspan="2" style="border:0.5px solid lightgrey;font-weight: bold;">수 신 : ${workInfo.workTo} 귀하</td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">상 호 : 오렌지 건축</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">대 표 : 서 정 호</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">업 체 : 건설업 / 도매</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">종 목 : 건축, 주방기구 일체</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold; text-align: left;">스크린골프 기기 판매</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold; text-align: left;">헬스 기구 납품</td>
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;font-weight: bold;"></td>
            <td colspan="3" style="border:0.5px solid lightgrey;font-weight: bold;text-align: left;">연 락 처 : 010-8238-6906</td>
        </tr>
        <tr>
            <td colspan="4" style="border:0.5px solid lightgrey;border-bottom : 0.5px solid black;font-weight: bold;">아래와 같이 견적서를 제출합니다</td>
            <td colspan="1" style="border:0.5px solid lightgrey;border-bottom : 0.5px solid black;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;border-bottom : 0.5px solid black;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;border-bottom : 0.5px solid black;font-weight: bold;"></td>
            <td colspan="1" style="border:0.5px solid lightgrey;border-bottom : 0.5px solid black;font-weight: bold;"></td>
            
        </tr>
        <tr>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">공 사 명</td>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">산출 근거 및 규격</td>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">수 량</td>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">단 위</td>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">단 가</td>
            <td colspan="2" style="border:0.5px solid black;font-weight: bold;text-align:center;">금 액</td>
            <td colspan="1" style="border:0.5px solid black;font-weight: bold;text-align:center;">비 고</td>
        </tr>
        ${workListStr}
        <tr>
            <td colspan="8" style="border-bottom : 0.5px solid black;height: 3px;font-size:3px;"> </td>
        </tr>
        <tr>
            <td colspan="1" style="font-size:20px;border:0.5px solid black;font-weight: bold;text-align:center;text-decoration:under-line;">합계</td>
            <td colspan="4" style="font-size:20px;border:0.5px solid black;font-weight: bold;text-align:right;">${totalPrice}</td>
            <td colspan="3" style="font-size:20px;border:0.5px solid black;font-weight: bold;text-align:center;text-decoration:under-line;">₩ (VAT포함)</td>
        </tr>
    </tbody>
    `;
}

//합계 금액 변동
const changeTotalPriceState = e=>{
    const priceList = document.querySelectorAll('.work-price');
    let totalPrice = 0;
    priceList.forEach(priceElem => totalPrice += Number(priceElem.value));
    document.querySelector('.work-totalprice').value = Number(totalPrice);
};
