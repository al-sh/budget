import{r as u,j as a,B as o,a4 as y,I as w}from"./index-42a4afd0.js";import{g as S,A as i}from"./Api-477fc52a.js";const C=(e,c,t)=>{const s=document.createElement("a"),d=new Blob([e],{type:t});s.href=URL.createObjectURL(d),s.download=c,s.click(),URL.revokeObjectURL(s.href)},r=async(e,c)=>{const t=new FormData;c&&t.append("fileData",c),await S().send({endpoint:e,method:"POST",isFile:!0,data:t})},F=()=>{const[e,c]=u.useState(void 0),t=S(),s=async()=>{e&&await r(i.SYNC+"/upload/categories",e)},d=async()=>{e&&await r(i.SYNC+"/upload/accounts",e)},j=async()=>{e&&await r(i.SYNC+"/upload/transactions",e)},m=async()=>{var h,g,p;const n={accounts:JSON.parse(localStorage.accounts),categories:JSON.parse(localStorage.categories),transactions:JSON.parse(localStorage.transactions)},l=await t.send({endpoint:i.SYNC+"/upload/all/raw",method:"POST",data:n});w.info({message:`Количество ошибок: ${l.errors.length} 
 Импортировано счетов: ${(h=l.imported)==null?void 0:h.accounts} 
Импортировано категорий: ${(g=l.imported)==null?void 0:g.categories} 
Импортировано транзакций: ${(p=l.imported)==null?void 0:p.transactions}`})},x=async()=>{e&&await r(i.SYNC+"/upload/all/file",e)},f=async()=>{const n=await t.send({endpoint:i.SYNC+"/download/all",method:"GET"});console.log(n),localStorage.accounts=JSON.stringify(n.accounts),localStorage.categories=JSON.stringify(n.categories),localStorage.transactions=JSON.stringify(n.transactions)};return a.jsxs(a.Fragment,{children:[a.jsx("h2",{children:"Синхронизация"}),a.jsx("input",{type:"file",id:"file",name:"file",onChange:n=>{n.target.files&&n.target.files[0]&&c(n.target.files[0])}}),a.jsx("h3",{children:"Категории"}),a.jsx("div",{children:a.jsx(o,{onClick:s,children:"Загрузить"})}),a.jsx("h3",{style:{marginTop:30},children:"Счета"}),a.jsx("div",{children:a.jsx("span",{children:a.jsx(o,{onClick:d,children:"Загрузить"})})}),a.jsx("h3",{style:{marginTop:30},children:"Транзакции"}),a.jsx("div",{children:a.jsx(o,{onClick:j,children:"Загрузить"})}),a.jsx("h3",{style:{marginTop:30},children:"Всё сразу - файлы"}),a.jsxs("div",{children:[a.jsx(o,{onClick:async()=>{const n=await t.send({endpoint:i.SYNC+"/download/all",method:"GET"});C(JSON.stringify(n),`budget_${y(new Date)}.json`,"text/plain")},children:"Выгрузить"}),a.jsx(o,{onClick:x,children:"Загрузить"})]}),a.jsx("h3",{style:{marginTop:30},children:"Всё сразу - storage"}),a.jsxs("div",{children:[a.jsx(o,{onClick:m,children:"Сохранить"}),a.jsx(o,{onClick:f,children:"Получить"})]})]})};export{F as default};
