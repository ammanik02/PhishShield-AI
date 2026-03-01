from PIL import Image
import io
from typing import Dict
import asyncio

class OCRPipeline:
    """
    OCR pipeline for extracting text from images
    Uses EasyOCR in production, simulated for demo
    """
    
    def __init__(self):
        self.initialized = False
        # In production: self.reader = easyocr.Reader(['en'])
    
    async def extract_text(self, image_data: bytes) -> Dict:
        """
        Extract text from image using OCR
        """
        try:
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Simulate OCR processing
            await asyncio.sleep(0.3)
            
            # In production, use actual OCR:
            # result = self.reader.readtext(np.array(image))
            # text = ' '.join([detection[1] for detection in result])
            
            # For demo, return simulated text based on common phishing patterns
            text = self._simulate_ocr_extraction(image)
            
            return {
                'text': text,
                'confidence': 0.92,
                'language': 'en',
                'image_size': image.size
            }
        
        except Exception as e:
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def _simulate_ocr_extraction(self, image: Image) -> str:
        """
        Simulate OCR text extraction for demo purposes
        In production, this would use actual EasyOCR/Tesseract
        """
        # Return a sample phishing text for demonstration
        return """
        URGENT SECURITY ALERT
        
        Your account has been temporarily suspended due to unusual activity.
        
        To restore access, please verify your identity immediately:
        Click here: secure-verify-account.com/restore
        
        You must act within 24 hours or your account will be permanently closed.
        
        Verification Code: #AX7829B
        
        Thank you,
        Security Team
        """
