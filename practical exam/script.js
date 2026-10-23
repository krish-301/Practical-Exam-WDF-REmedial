const feedbackForm = document.getElementById("feedbackForm");

function calculateAverage(teaching, practical, content) {
  return (Number(teaching) + Number(practical) + Number(content)) / 3;
}

function calculatePersantage(average) {
  return (average / 5) * 100;
}

function getClassification(average) {
  if (average >= 4.5) {
    return "Excellent";
  } else if (average >= 3.5) {
    return "Very good";
  } else if (average >= 2.5) {
    return "Good";
  } else if (average >= 1.5) {
    return "Need improvement";
  }
  return "Poor";
}

function getRecommendation(classification) {
  const recommendations = {
    Excellent: "Maintain current teaching approach.",
    "Very good": "Minor improvement may be considered.",
    Good: "Improvement is required in selected areas.",
    "Need improvement": "Review teaching content delivery.",
    Poor: "An immediate improvement plan is required."
  };

  return recommendations[classification];
}

function validateFeedback() {
  const fields = [
    {
      id: "studentName",
      errorId: "studentNameError",
      message: "Please enter the student name."
    },
    {
      id: "courseName",
      errorId: "courseNameError",
      message: "Please enter the course name."
    },
    {
      id: "facultyName",
      errorId: "facultyNameError",
      message: "Please enter the faculty name."
    }
  ];
  let isValid = true;

  fields.forEach(function (field) {
    const value = document.getElementById(field.id).value.trim();
    const error = document.getElementById(field.errorId);

    if (value === "") {
      error.textContent = field.message;
      isValid = false;
    } else {
      error.textContent = "";
    }
  });

  const ratingFields = [
    { id: "teachingRating", errorId: "teachingRatingError", label: "Teaching" },
    { id: "practicalRating", errorId: "practicalRatingError", label: "Practical lab" },
    { id: "contentRating", errorId: "contentRatingError", label: "Content" }
  ];

  ratingFields.forEach(function (field) {
    const value = document.getElementById(field.id).value.trim();
    const rating = Number(value);
    const error = document.getElementById(field.errorId);

    if (value === "" || isNaN(rating) || rating < 1 || rating > 5) {
      error.textContent = field.label + " rating must be a number from 1 to 5.";
      isValid = false;
    } else {
      error.textContent = "";
    }
  });

  return isValid;
}

function submitFeedback() {
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = "";

  if (!validateFeedback()) {
    formMessage.textContent = "Please correct the fields marked with an error.";
    alert("Please complete the required details and enter ratings from 1 to 5.");
    return;
  }

  const studentName = document.getElementById("studentName").value.trim();
  const courseName = document.getElementById("courseName").value.trim();
  const facultyName = document.getElementById("facultyName").value.trim();

  if (!confirm("Submit feedback for " + studentName + " now?")) {
    formMessage.textContent = "Submission cancelled. Your current results were not changed.";
    return;
  }

  var suggestion = prompt("Optional: what one improvement would you suggest?");
  const teaching = Number(document.getElementById("teachingRating").value);
  const practical = Number(document.getElementById("practicalRating").value);
  const content = Number(document.getElementById("contentRating").value);
  const average = calculateAverage(teaching, practical, content);
  const percentage = calculatePersantage(average);
  const classification = getClassification(average);
  const recommendation = getRecommendation(classification);
  const ratings = [
    { name: "Teaching", score: teaching },
    { name: "Practical lab", score: practical },
    { name: "Content", score: content }
  ];
  const lowestRating = Math.min(teaching, practical, content);
  const lowestCategories = ratings
    .filter(function (rating) {
      return rating.score === lowestRating;
    })
    .map(function (rating) {
      return rating.name;
    });
  const ratingCounts = {
    Excellent: 0,
    "Very good": 0,
    Good: 0,
    "Need improvement": 0,
    Poor: 0
  };

  let count = 0;
  while (count < ratings.length) {
    ratingCounts[getClassification(ratings[count].score)] += 1;
    count += 1;
  }

  document.getElementById("feedbackSummary").textContent =
    "Feedback submitted by " + studentName + " for " + courseName +
    " (Faculty: " + facultyName + ").";
  document.getElementById("resultDetails").hidden = false;
  document.getElementById("averageResult").textContent = average.toFixed(2);
  document.getElementById("percentageResult").textContent = percentage.toFixed(2);
  document.getElementById("teachingResult").textContent = teaching;
  document.getElementById("practicalResult").textContent = practical;
  document.getElementById("contentResult").textContent = content;
  document.getElementById("lowestResult").textContent =
    lowestCategories.join(" and ") + " (" + lowestRating + " out of 5)";
  document.getElementById("commentResult").textContent =
    document.getElementById("comments").value.trim() || "No comment provided.";
  document.getElementById("suggestionResult").textContent =
    suggestion === null || suggestion.trim() === "" ? "No suggestion provided." : suggestion.trim();
  document.getElementById("highRatingMessage").textContent =
    teaching >= 4.5 && practical >= 4.5 && content >= 4.5
      ? "Great work! All three areas received a rating of at least 4.5."
      : "";

  const ratingCountsList = document.getElementById("ratingCounts");
  ratingCountsList.textContent = "";
  Object.keys(ratingCounts).forEach(function (ratingClass) {
    const listItem = document.createElement("li");
    listItem.textContent = ratingClass + ": " + ratingCounts[ratingClass];
    ratingCountsList.appendChild(listItem);
  });

  const classificationResult = document.getElementById("classificationResult");
  classificationResult.textContent = "Classification: " + classification;
  classificationResult.className =
    "classification-result classification-" +
    classification.toLowerCase().replace(" ", "-");
  document.getElementById("recommendationText").textContent = recommendation;
  formMessage.textContent = "Feedback submitted successfully.";
  alert("Thank you! Your feedback was submitted successfully.");
}

function resetFeedback() {
  if (!confirm("Are you sure you want to clear the form and feedback results?")) {
    return;
  }

  feedbackForm.reset();
  document.getElementById("formMessage").textContent = "";
  document.getElementById("feedbackSummary").textContent =
    "Your feedback summary will appear here after submission.";
  document.getElementById("resultDetails").hidden = true;
  document.getElementById("averageResult").textContent = "";
  document.getElementById("percentageResult").textContent = "";
  document.getElementById("teachingResult").textContent = "";
  document.getElementById("practicalResult").textContent = "";
  document.getElementById("contentResult").textContent = "";
  document.getElementById("lowestResult").textContent = "";
  document.getElementById("ratingCounts").textContent = "";
  document.getElementById("highRatingMessage").textContent = "";
  document.getElementById("commentResult").textContent = "";
  document.getElementById("suggestionResult").textContent = "";
  document.getElementById("classificationResult").textContent = "";
  document.getElementById("classificationResult").className = "classification-result";
  document.getElementById("recommendationText").textContent =
    "A recommendation will appear here after you submit your feedback.";

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(function (error) {
    error.textContent = "";
  });

  alert("The form and results have been reset.");
}

document.getElementById("submitFeedback").addEventListener("click", submitFeedback);
document.getElementById("resetFeedback").addEventListener("click", resetFeedback);
