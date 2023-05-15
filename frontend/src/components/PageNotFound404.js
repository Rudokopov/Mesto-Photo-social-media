import { Link } from "react-router-dom";

function PageNotFound404() {
  return (
    <>
      <div className="not-found-page__container">
        <img
          className="not-found-page__image"
          src="https://thumbs.gfycat.com/DescriptiveFluidFrogmouth-size_restricted.gif"
          alt="Не туда попал"
        />
        <h2 className="not-found-page__title">
          Ой, кажется такой страницы не существует или у вас нет доступа
        </h2>

        <Link className="not-found-page__button" to="/">
          Назад
        </Link>
      </div>
    </>
  );
}

export default PageNotFound404;
