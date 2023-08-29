async function fetchData() {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)                
        }
        const data = await response.json();
        return data;
    } catch (error) {   
        console.error(`Could not get expense data: ${error}`);
    }
}

function displayGraph(data) {   
    const bars = document.querySelectorAll(".bar");
    
    //get the total of daily amounts which will be used compute bar height,  
    let total = 0 
    let amounts = []       
    for (let i = 0; i < data.length; i++) {
        total += data[i].amount;
        amounts.push(data[i].amount);
    }
 
    let i=0;

    //get the current day
    const date = new Date();    
    let currentDay = date.getDay();
    
    //shift the day to match a Monday week start:
    if (currentDay === 0) {
        currentDay = 6;        
    } else {
        currentDay --
    } 

    //loop through all the bar divs and display amounts in the detail tooltips, 
    //compute and set the bar's height, and add event listeners to the bars to 
    //show and hide the tooltips on mouseover and mouseout
    for (const bar of bars) {  
        const barId = bar.getAttribute("id");
        const detail = document.querySelector(`#${barId}-detail`);         
        detail.textContent = `$${data[i].amount}`;
        bar.style.height = `${Math.floor(data[i].amount / total * 500)}px`;

        if (i === currentDay) {
            bar.setAttribute("class", "bar current-day")            
        }
    
        bar.addEventListener("mouseover", (e) => {
            const barId = e.target.getAttribute("id");  
            const detail = document.querySelector(`#${barId}-detail`);
            detail.style.visibility = "visible";
        });
        bar.addEventListener("mouseout", (e) => {
            const barId = e.target.getAttribute("id");    
            const detail = document.querySelector(`#${barId}-detail`);
            detail.style.visibility = "hidden";
        });      
        
        i++
    }
}

//fetch the daily expense amounts data
//and use the data to display the graph
const promise = fetchData();    
promise.then((data) => {
    displayGraph(data);
});