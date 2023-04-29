import React from "react";
import fullStar from "/icons/full-star.png";
import halfStar from "/icons/half-star.png";
import emptyStar from "/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../utils/calculateReviewAverage";

// Define the Stars component
export default function Stars({
  reviews, // Array of Review objects
  rating, // Optional numeric rating value
}: {
  reviews: Review[];
  rating?: number;
}) {
  // Calculate the review rating average or use the given rating value
  const reviewRating = rating || calculateReviewRatingAverage(reviews);

  //?Function to render the star UI based on the review rating

  /*
?The renderStars function is responsible for generating the star rating UI based on the reviewRating value. Here's a breakdown of the algorithm:
!1. Initialize an empty array stars to store the star images.

!2. Iterate through a loop from 0 to 4 (5 times, one for each star).

!3. Calculate the difference between the current reviewRating and the loop index i. This is rounded to 1 decimal place and then converted to a float.

!4.  If the difference is greater than or equal to 1, it means that the current star should be a full star. So, push fullStar into the stars array.

!5. If the difference is between 0 and 1, it means that the current star could be a half or empty star.
*If the difference is less than or equal to 0.2, it means that the star should be an empty star, so push emptyStar into the stars array.
*If the difference is between 0.2 and 0.6, it means that the star should be a half star, so push halfStar into the stars array.
*If the difference is greater than 0.6, it means that the star should be a full star, so push fullStar into the stars array.

!6. If the difference is not greater than or equal to 1 and not between 0 and 1, it means that the star should be an empty star. So, push emptyStar into the stars array.

!7. After the loop is done, map over the stars array, and for each star image, return an Image component with the corresponding src, an empty alt attribute, and a CSS class w-4 h-4 mr-1. Assign the loop index index as the key for each Image component.

!8. Return the array of Image components as the result of the renderStars function.
  */
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((reviewRating - i).toFixed(1));
      if (difference >= 1) stars.push(fullStar);
      else if (difference < 1 && difference > 0) {
        if (difference <= 0.2) stars.push(emptyStar);
        else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else stars.push(emptyStar);
    }

    // Return the star images as JSX elements
    return stars.map((star, index) => {
      return <Image key={index} src={star} alt="" className="w-4 h-4 mr-1" />;
    });
  };

  // Render the star rating UI
  return <div className="flex items-center">{renderStars()}</div>;
}
