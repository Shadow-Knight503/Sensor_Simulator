import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, onValue, child, equalTo, 
  orderByValue, push, update } from "firebase/database";
import { scheduleJob } from "node-schedule"
import pkg from "express"
const server = pkg()
const dirname = "C:/Users/JEGAN/Firebase1-8/src/"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR09EzSIGaIho5COhhDsrOFqooR3_5HeM",
  authDomain: "fir-study-cc65b.firebaseapp.com",
  databaseURL: "https://fir-study-cc65b-default-rtdb.firebaseio.com",
  projectId: "fir-study-cc65b",
  storageBucket: "fir-study-cc65b.appspot.com",
  messagingSenderId: "309088429559",
  appId: "1:309088429559:web:2fcba1a4c979cbf4087af2",
  measurementId: "G-1JLJPL86BS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const ComName = "DemoComp" 
const TempVal = 100
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();

server.get("/", async (req, res) => {
  console.log("Works")
  res.sendFile(dirname + 'Home.html')
});

server.listen(4000, () => {
  console.log("server up and running on PORT : 4000");
});

let i = 5
console.log(`${date}-${month}-${year}`)
const Db = getDatabase()

function HtmlStuff() {
  
}

function Main() {  
  const Refer = ref(Db, 'Companies')
  const refers = ref(Db, "Companies/" + ComName)
  const referH = ref(Db, `Companies/${ComName}/Hours`)

  onValue(Refer, (snapshot) => {
    if (snapshot.child(ComName).exists()){
      const userData = snapshot.val();
    } else {
      console.log('Works ?')
      set(refers, {
        Hours: 0,
        Weeks: 0 
      })
      for(var i = 0; i < 60; i++) {
        let Min_Model = `Min: ${("0" + i).slice(-2)}` 
        update(referH, {
          [Min_Model]: 0
        })
      }
    }
  })
}

Main()

scheduleJob('* * * * *', () => {
  console.log("Working...")
  let date = new Date
  let min = ("0" + date.getMinutes()).slice(-2)
  let min_temp = `Min: ${min}`;
  let date_format = `${('0' + date.getDate()).slice(-2)}-${('0' + date.getMonth()).slice(-2)}-${date.getFullYear()}`
  const referW = ref(Db, `Companies/${ComName}/Weeks`)
  const referH = ref(Db, `Companies/${ComName}/Hours`)
  const referTemp = ref(Db, `Companies/${ComName}/Weeks/03-09-2022`)
  
  console.log(`Min: ${min}`)
  update(referH, {
    [min_temp]: TempVal 
  })
  if (min == '40') {
    console.log('Works ?!')
    onValue(referH, (snapshot) => {
      const Data = snapshot
      var TtlVal = 0
      Data.forEach(element => {
        TtlVal += +(element.val())
      });
      for(var i = 12; i < 19; i++) {
        var Var =  
        update(referTemp, {
          [i]: 0
        })
        const referVAR = ref(Db, `Companies/${ComName}/Weeks/03-09-2022/${i}`)
        update(referVAR, {
          Tmp: Math.round(((Math.random() * 10) + 70) * 100) / 100,
          Pwr: Math.round(((Math.random() * 50) + 200) * 100) / 100 
        })
      }
      let FnVal = TtlVal / 60
      onValue(referW, (snapshot) => {
        if (!snapshot.child(date_format).exists()){
          update(referW, {
            [date_format]: 0
          })
        }
      })
      var refeVar = ref(Db, `Companies/${ComName}/Weeks/${date_format}`)
      update(refeVar, {
        [('0' + date.getHours()).slice(-2)]: FnVal,
      })
    })
  }
})


