"use strict";
const studentData = "https://petlatkea.dk/2020/hogwarts/students.json";

let studArray = [];
let filteredStud = [];
let expelledStud = [];
let families = {};
let hacked = false;

const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    img: "",
    gender: "",
    house: "",
    bloodStatus: "",
    expelled: false,
    prefect: false,
    inquisitorial: false
};

document.addEventListener("DOMContentLoaded", compileData);
document.addEventListener("keydown", secretKeyStroke);

function secretKeyStroke(e) {
  if (e.code === "KeyH") {
   hackTheSystem();
  }
}

async function compileData() {
    let jsonData = await loadJSON();
    cleanData(jsonData);
    dropDown();
    clickButtons();
    showStudents(studArray);
    //searching(studArray);
}

function loadJSON(){
    return fetch(studentData)
    .then( response => response.json() )
    .then( jsonData => {
        // when loaded, prepare objects
        return jsonData;
    });
};

  function cleanData(jsonData) {
    jsonData.forEach(student => {
        // trimming and splitting, and creating the student object inside the array
        let nameArray = student.fullname.trim().split(" ");
        const createStudent = Object.create(Student);
        createStudent.firstName = capitalize(nameArray[0]);
        //checking how many names, adn capitalizing
        if (nameArray.length == 2) {
          createStudent.lastName = capitalize(nameArray[1]);
          createStudent.middleName = " ";
        } else if (nameArray.length == 3) {
          createStudent.lastName = capitalize(nameArray[2]);
          //Only nicknames includes "", so checking for nicknames.
          if (nameArray[1].includes('"')) {
            createStudent.nickName = capitalize(nameArray[1].substring(1, nameArray[1].length - 1));
            createStudent.middleName = " ";
          } else {
            createStudent.middleName = capitalize(nameArray[1]);
          }
        }
        createStudent.house = capitalize(student.house.trim());
        // finding student images from file-name pattern
        //createStudent.img = studImg(createStudent);
        createStudent.gender = capitalize(student.gender.trim());
        //createStudent.bloodstatus = bloodType(createStudent);    

        studArray.push(createStudent);
      });
  }

  function capitalize(name) {
    if (name.includes("-")) {
        let hyphen = name.indexOf("-") + 1;
        return (
          name[0].toUpperCase() + name.substring(1, hyphen) + name[hyphen].toUpperCase() + name.substring(hyphen + 1, name.length).toLowerCase()
        );
      }
      return name[0].toUpperCase() + name.substring(1, name.length).toLowerCase();
  }

  function studImg(student) {
     let imgName = student.lastName.toLowerCase() + "_" + student.firstName[0].toLowerCase() + ".png";

      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
    let xmlReq = new XMLHttpRequest();
    xmlReq.open('HEAD', "images/" + imgName, false);
    xmlReq.send();
  
    if (xmlReq.status !== 404) {
      return imgName;
    } else {
      imgName = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
      xmlReq.open('HEAD', "images/" + imgName, false);
      xmlReq.send();
  
      if (xmlReq.status !== 404) {
        return imgName;
      } else {
        return "placeholder.png";
      }
    }
  }
  

  function dropDown() {
    document.querySelector(".filter_dropdown").addEventListener("click", filterDropDown);
    document.querySelector(".sort_dropdown").addEventListener("click", sortDropDown);
}

function filterDropDown() {
    document.querySelector(".filter_buttons").classList.toggle("hide");

}

function sortDropDown() {
    document.querySelector(".sort_buttons").classList.toggle("hide");
}

function clickButtons() {
    document.querySelectorAll(".filter").forEach(btn => {
        btn.addEventListener("click", filterBy);
    });
    document.querySelectorAll(".sort").forEach(btn => {
        btn.addEventListener("click", sortBy);
    });
}

function filterBy() {
    let filter = this.dataset.filter;

    document.querySelector(".filtered_by").textContent = this.textContent;
    if (filter === "all") {
        filteredStud = studArray;
    } else if (filter === "exp") {
        filteredStud = expelledStud;
    } else {
        filteredStud = studArray.filter(stud => {
            return stud.house.toLowerCase() === filter; 
            //Fixing faulty elements to fit into the filter.
        });
    }
showStudents(filteredStud);
console.log("test");
}


//Filters all students of house Gryffindor

function gryffindorStudents() {
  return studArray.filter(elm => {
      return elm.house === 'Gryffindor';
  });
}

function hufflepuffStudents() {
  return studArray.filter(elm => {
      return elm.house === 'Hufflepuff';
  });
}
function ravenclawStudents() {
  return studArray.filter(elm => {
      return elm.house === 'Ravenclaw';
  });
}

function slytherinStudents() {
  return studArray.filter(elm => {
      return elm.house === 'Slytherin';
  });
}

function sortBy(event) {
  let sort = this.dataset.sort;
  let sorted = studArray;
  const sortBy = event.target.dataset.sort;

  if (sortBy === "firstName") {
    sorted = sorted.sort(sortByFirstname);
  } else if (sort === "lastName") {
    sorted = sorted.sort(sortByLastname);
  }
  showStudents(sorted);
  console.log("test");
}

function sortByFirstname(studentA, studentB) {
  console.log("test");
if (studentA.firstName < studentB.firstName) {
  return -1;
} else {
  return 1;
}
}

function sortByLastname(studentA, studentB) {
  console.log("test");
if (studentA.lastName < studentB.lastName) {
  return -1;
} else {
  return 1;
}
}

  function showStudents(student) {
      document.querySelector(".student_container .inner_con").innerHTML = " ";
      student.forEach(displayStudents);
      showInfobox(student);
  }

  function showInfobox(student) {
    document.querySelector("[data-field=all] span").textContent = studArray.length;
    document.querySelector("[data-field=displayed] span").textContent = student.length;
    document.querySelector("[data-field=expelled] span").textContent = expelledStud.length;
    document.querySelector("[data-field=sly] span").textContent = slytherinStudents().length;
    document.querySelector("[data-field=rav] span").textContent = ravenclawStudents().length;
    document.querySelector("[data-field=huf] span").textContent = hufflepuffStudents().length;
    document.querySelector("[data-field=gryf] span").textContent = gryffindorStudents().length;

  }

  function displayStudents(student) {
      const container = document.querySelector(".student_container .inner_con");
      const template = document.querySelector("template");
      let clone = template.cloneNode(true).content;

      clone.querySelector("img").src = `images/${student.img}`;
      clone.querySelector(".name").textContent = student.firstName + " " + student.lastName;
      clone.querySelector(".house").textContent = student.house;
      clone.querySelector(".student").addEventListener("click", () => showPopup(student));
      
      container.appendChild(clone);
      console.log("test4");
  }

  function showPopup(student) {

  }
  function searching(student) {

  }

  function hackTheSystem() {
    document.removeEventListener("keydown", secretKeyStroke);
  
    alert("The pahe has been hacked");
    console.log("Hacking successful");
    document.querySelector(".student_popup").classList.add("hacked");
  
    hacked = true;
    const hacker = Object.create(Student);
    hacker.firstName = "Nikoline";
    hacker.middleName = "E";
    hacker.lastName = "N";
    hacker.img = "hacker.png";
    hacker.house = "Hufflepuff";
    hacker.gender = "none";
    hacker.bloodstatus = "Candy";
    hacker.hacker = true;
  
    studArray.forEach(student => {
      bloodType(student);
    });
  
    studArray.push(hacker);
    showStudents(studArray);
  }