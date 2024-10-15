
export default function SpinnerOnLoading() {

    return (
      <div className="w-full flex items-center justify-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
          <span className="visually-hidden"></span>
      </div>
  </div>
    );
}
