const MenuBackDrop = () => {
  return (
    <div>
      <style jsx>{`
        div {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: rgba(0, 0, 0, 0.6);
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  )
}
export default MenuBackDrop
