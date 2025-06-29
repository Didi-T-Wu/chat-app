import CardWithForm  from "./CardWithForm";

const myForm = ({onSubmit, cardTitle, cardDescription, inputFieldProps, footerButtonProps}) => {
  return (
  <form onSubmit = { onSubmit } >
    <CardWithForm
      cardTitle= {cardTitle}
      cardDescription= { cardDescription }
      inputFieldProps={ inputFieldProps}
      footerButtonProps={footerButtonProps}
    />
  </form>)}


export default myForm
