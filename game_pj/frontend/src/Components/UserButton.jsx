
const UserButton = ({
    type = "button",
    onClick,
    text_human

}) => {
    return (

        <div className="form-item">
            <button
                type={type}
                onClick = {onClick}
            >
                {text_human}
            </button>
        </div>
    );
};
export default UserButton;