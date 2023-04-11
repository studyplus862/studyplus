import { LinearProgress } from '@material-ui/core'
import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

function LinearProgressWithLabel(props) {
  return (
    <Stack direction="column" sx={{px:1,my:1}}>
        <Typography sx={{my:1}} variant="body2" color="text.secondary">{`${Math.round(
            props.value,
            )}% Uploading`}</Typography>
        <LinearProgress variant="determinate" {...props} />

    </Stack>
 

  )
}

export default LinearProgressWithLabel