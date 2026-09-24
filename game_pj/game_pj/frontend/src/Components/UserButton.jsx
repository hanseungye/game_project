const UserButton = ({
    type = "button",
    text_human
}) => {
    return (

        <div className="form-item">
            <button
                type={type}
            >
                {text_human}
            </button>
        </div>
    );
};
export default UserButton;