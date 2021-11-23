let data_ready = false;
let filterTags = [];
const formatedJobList = [];
const root = document.getElementById("jobList");

let data_url = "./data.json";

let request = new XMLHttpRequest();

request.open("GET", data_url);

request.responseType = "json";
request.send();

request.onload = function () {
	const user_data = request.response;
	data_ready = true;
	for (row of user_data) {
		//reformating array user_data to a new array for easy filtering proccess
		const newRow = {
			id: row.id,
			company: row.company,
			contract: row.contract,
			featured: row.featured,
			location: row.location,
			logo: row.logo,
			new: row.new,
			position: row.position,
			postedAt: row.postedAt,
			tags: [],
		};

		newRow.tags.push(row.role);
		newRow.tags.push(row.level);
		newRow.tags.push.apply(newRow.tags, row.tools);
		newRow.tags.push.apply(newRow.tags, row.languages);

		formatedJobList.push(newRow);
	}
	showFilters();
	showJobList(formatedJobList);
};

const filteredJobList = (filters, allRows) => {
	console.log("Applying Filter :" + filters);
	//Create new job list that is filtered
	let filteredJobs = [];

	//if no filter apply, use all rows for listing jobs
	if (filters.length === 0) {
		filteredJobs = allRows.slice();
	}
	//filter allRows based on tags of each rows
	else {
		filteredJobs = allRows.filter((el) =>
			filters.every((r) => el.tags.indexOf(r) >= 0)
		);
	}
	return filteredJobs;
};

const showFilters = () => {
	//console.dir(filterTags);
	const jobFilter = document.getElementById("jobFilter");
	jobFilter.innerHTML = "";

	if (filterTags.length === 0) {
		jobFilter.className = "filter hide";
	} else {
		jobFilter.className = "filter";
		const filterWrapper = document.createElement("ul");
		jobFilter.appendChild(filterWrapper);

		const clearFilter = document.createElement("a");
		clearFilter.setAttribute("href", "#");
		clearFilter.innerText = "Clear";
		clearFilter.addEventListener("click", clearFilterHandler);
		jobFilter.appendChild(clearFilter);

		for (filter of filterTags) {
			const filterLi = document.createElement("li");
			filterWrapper.appendChild(filterLi);

			filterSpan = document.createElement("span");
			filterSpan.innerText = filter;
			filterLi.appendChild(filterSpan);

			filterLink = document.createElement("a");
			filterLink.setAttribute("href", "#");
			filterLink.addEventListener("click", removeValue.bind(null, filter));
			filterLi.appendChild(filterLink);
		}
	}
};

const showJobList = (jobs) => {
	root.innerHTML = "";
	for (newRow of jobs) {
		const jobInfo = document.createElement("div");
		jobInfo.className = "job-info";

		root.appendChild(jobInfo);

		const logoJob = document.createElement("div");
		logoJob.className = "logo-job";
		jobInfo.appendChild(logoJob);

		const jobImage = document.createElement("img");
		jobImage.src = newRow.logo;
		logoJob.appendChild(jobImage);

		const jobSnapshot = document.createElement("div");
		jobSnapshot.className = "job-snapshot";
		logoJob.appendChild(jobSnapshot);

		const addInfo = document.createElement("div");
		addInfo.className = "additional";

		const employer = document.createElement("h2");
		employer.innerText = newRow.company;
		addInfo.appendChild(employer);

		if (newRow.new) {
			const newBadge = document.createElement("span");
			newBadge.className = "badge new";
			newBadge.innerText = "New!";
			addInfo.appendChild(newBadge);
		}
		if (newRow.featured) {
			const featuredBadge = document.createElement("span");
			featuredBadge.className = "badge featured";
			featuredBadge.innerText = "Featured";
			addInfo.appendChild(featuredBadge);
		}
		jobSnapshot.appendChild(addInfo);

		const jobTitle = document.createElement("h1");
		jobTitle.className = "job-title";
		jobTitle.innerText = newRow.position;

		jobSnapshot.appendChild(jobTitle);

		const timePlace = document.createElement("ul");
		timePlace.className = "time-place";
		const numDays = document.createElement("li");
		numDays.innerText = newRow.postedAt;
		const dotOne = document.createElement("li");
		dotOne.innerText = ".";
		const workingTime = document.createElement("li");
		workingTime.innerText = newRow.contract;
		const dotTwo = document.createElement("li");
		dotTwo.innerText = ".";
		const workingPlace = document.createElement("li");
		workingPlace.innerText = newRow.location;

		timePlace.appendChild(numDays);
		timePlace.appendChild(dotOne);
		timePlace.appendChild(workingTime);
		timePlace.appendChild(dotTwo);
		timePlace.appendChild(workingPlace);

		jobSnapshot.appendChild(timePlace);

		const jobTags = document.createElement("ul");
		jobTags.className = "job-tags";
		jobInfo.appendChild(jobTags);

		for (tag of newRow.tags) {
			const tagList = document.createElement("li");
			jobTags.appendChild(tagList);
			const tagLink = document.createElement("a");
			tagList.appendChild(tagLink);

			tagLink.setAttribute("href", "#");
			tagLink.className = "tag-badge";
			tagLink.innerText = tag;
			tagLink.addEventListener("click", addFilter.bind(null, tag));
		}
	}
};

const addFilter = (filter) => {
	if (!filterTags.includes(filter)) {
		filterTags.push(filter);
		showFilters();
		showJobList(filteredJobList(filterTags, formatedJobList));
	}
};

const clearFilterHandler = () => {
	filterTags = [];
	showFilters();
	showJobList(filteredJobList(filterTags, formatedJobList));
};

const removeValue = (value) => {
	if (filterTags.indexOf(value) !== -1) {
		filterTags = filterTags.filter((val) => val !== value);
		showFilters();
		showJobList(filteredJobList(filterTags, formatedJobList));
	}
};
