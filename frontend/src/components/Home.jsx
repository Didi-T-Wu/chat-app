
import React,{ useState} from 'react'
import SelectWithinPopover from './ui/myUI/mySelectWithinPopover'

const Home = () => {

  const [isPrivate, setIsPrivate] = useState(null)

  const onHandleRoomPrivacyChange = (selectedItems) => {
    const valArray= selectedItems.value
    console.log("in home, privacy", isPrivate);
    // console.log(selectedItems[0])
    setIsPrivate(valArray[0]);
  };

  return (
    <div>
      <h1>Home</h1>
      <SelectWithinPopover onChange={onHandleRoomPrivacyChange}/>
    </div>)
}


export default Home
