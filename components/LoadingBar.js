const LoadingBar = ({}) => {
  return (
    <div>
      <p>Loading</p>

      <style jsx>
        {`
          div {
            position: absolute;
            top: 1em;
            right: 1em;
            opacity: 0.5;
          }
        `}
      </style>
    </div>
  )
}

export default LoadingBar;
