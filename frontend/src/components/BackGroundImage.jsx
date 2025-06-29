import {  Image, Box } from "@chakra-ui/react"
import backgroundImage  from '../assets/kuu-akura-pnK6Q-QTHM4-unsplash.jpg'
const BackGroundImage = () => {

    return (
        <div>
          <Image
            src={backgroundImage}
            position="absolute"
            left={0}
            top={0}
            zIndex={-1}
            w="100%"
            h="100%"
            objectFit="cover"
            filter ="brightness(130%)"
            />
           <Box
              position="absolute"
              bottom="2"
              right="2"
              fontSize="xs"
            >
            Photo by{' '}
            <a
              href="https://unsplash.com/@akurakuu?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            > kuu akura</a>{' '}on{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            > Unsplash </a>
            </Box>
        </div>
    )
}

export default  BackGroundImage