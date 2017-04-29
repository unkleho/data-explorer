const LoadingBar = ({}) => {
  return (
    <div>
      <p>Loading</p>

      <style jsx>
        {`
          div {
            position: absolute;
            top: 0.8em;
            right: 1em;
            opacity: 0.5;
            color: white;
          }
        `}
      </style>
    </div>
  )
}

export default LoadingBar;
