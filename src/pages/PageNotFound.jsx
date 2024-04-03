import PageNotFoundCSS from "./PageNotFound.module.css";
export default function PageNotFound() {
  return (
    <div className={PageNotFoundCSS.container}>
      <h1>Page not found 😢</h1>
    </div>
  );
}
