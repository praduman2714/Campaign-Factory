import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

interface Props {
  item: string;
}

export default function OutlinedCard({ item }: Props) {
  const router = useRouter();

  const handleShowDetails = (selectedAddress: string) => {
    router.push({
      pathname: 'viewCampaign',
      query: { item: item }
    });
  }

  return (
    <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card 
        variant="outlined"
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          },
          padding: '16px'
        }}
      >
        <CardContent>
          <Typography 
            sx={{ fontSize: 14, color: '#555', mb: 1 }} 
            gutterBottom
          >
            Campaign Address
          </Typography>
          <Typography 
            variant="body1" 
            component="div"
            sx={{ wordBreak: 'break-word', mb: 2, fontWeight: 'bold', color: '#333' }}
          >
            {item}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => handleShowDetails(item)}
            size="small"
            variant="contained"
            color="primary"
            className='bg-blue-400 hover:bg-blue-700'
            sx={{
              textTransform: 'none',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
