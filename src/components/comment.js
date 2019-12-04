import {getFormatedDiffrenceDate} from '../util';

const createCommentTemplate = (comment) => {
  const {text, author, emotion, commentDate} = comment;
  const formattedDate = getFormatedDiffrenceDate(commentDate, new Date());
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `;
};

export const createCommentsTemplate = (comments) => {
  const commentsTemplate = comments.map((comment) => createCommentTemplate(comment)).join(`\n`);
  return `<ul class="film-details__comments-list">
          ${commentsTemplate}
          </ul>`;
};

