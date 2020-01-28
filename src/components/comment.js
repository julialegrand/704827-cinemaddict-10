import {getFormatedDiffrenceDate} from '../utils/common.js';

const createCommentTemplate = (comment) => {
  const {id, comment: commentText, author, emotion, date} = comment;
  const formattedDate = getFormatedDiffrenceDate(date, new Date());

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${commentText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete" value="${id}">Delete</button>
        </p>
      </div>
    </li>
  `;
};

export const createCommentsTemplate = (comments) => {
  const commentsTemplate = comments.map(createCommentTemplate).join(`\n`);

  return `<ul class="film-details__comments-list">
          ${commentsTemplate}
          </ul>`;
};


