import React from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../../dist/css/custom_card.css';

const ProductItem = ({product}) => {
    const image = product.has_media 
        ? product.media[0].original_url 
        : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
    return (
        <div className="col-md-4 mt-2 mb-2">
            <Link to={`/products/${product.id}`}>
                <Card className="profile-card-4">
                    <CardMedia
                        component="img"
                        height="140"
                        image={image}
                        alt="Paella dish"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="max-height: 20px;">
                            {product.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
};

export default ProductItem;