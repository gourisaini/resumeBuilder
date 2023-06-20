const profilePic = document.querySelector(".profilePic");
  const uploadImg = document.querySelector(".uploadImg");
  profilePic.addEventListener("click", () => {
      uploadImg.click();
  });


  function AddNewField(){
	let newNode = document.createElement("textarea");
	newNode.classList.add("form-control");
	newNode.classList.add("m-auto");
	newNode.classList.add("mb-4");
	newNode.classList.add("w-75");
	newNode.classList.add("p-2");
	newNode.classList.add("wefield");
	newNode.setAttribute("placeholder","Work Experience");
	let we = document.getElementById("we");
	let AddField = document.getElementById("AddField");
	we.insertBefore(newNode,AddField);
}


function AddEduField(event){
        let newNode = document.createElement("div");
		let newtext = document.createTextNode("Details-");
		// newtext.classList.add("m-auto");
		// newtext.classList.add("w-75");
		// newtext.classList.add("mb-3");



		let newNode1 = document.createElement("input");
		newNode1.classList.add("form-control");
	    newNode1.classList.add("m-auto");
	    newNode1.classList.add("mb-4");
	    newNode1.classList.add("w-75");
	    newNode1.classList.add("p-2");
		newNode1.setAttribute("placeholder","Degree");
		newNode1.setAttribute("type","text");

		let newNode2 = document.createElement("input");
		newNode2.classList.add("form-control");
	    newNode2.classList.add("m-auto");
	    newNode2.classList.add("mb-4");
	    newNode2.classList.add("w-75");
	    newNode2.classList.add("p-2");
		newNode2.setAttribute("placeholder","College");
		newNode2.setAttribute("type","text");

		let newNode3 = document.createElement("input");
		newNode3.classList.add("form-control");
	    newNode3.classList.add("m-auto");
	    newNode3.classList.add("mb-4");
	    newNode3.classList.add("w-75");
	    newNode3.classList.add("p-2");
		newNode3.setAttribute("placeholder","Passing Year");
		newNode3.setAttribute("type","text");

		newNode.appendChild(newtext);
		newNode.appendChild(newNode1);
		newNode.appendChild(newNode2);
		newNode.appendChild(newNode3);

		let edu = document.getElementById("edu");
	   let AddEField = document.getElementById("AddEField");
	   edu.insertBefore(newNode,AddEField);

}