import re
import numpy as np
from typing import Dict, List
import asyncio

class NLPDetector:
    """
    NLP-based phishing and scam detection using pattern matching
    and linguistic analysis. In production, this would use a fine-tuned
    transformer model (DistilBERT/RoBERTa) for classification.
    """
    
    def __init__(self):
        self.urgency_keywords = [
            'urgent', 'immediately', 'act now', 'limited time', 'expires',
            'suspended', 'locked', 'verify now', 'confirm now', 'within 24 hours',
            'last chance', 'final notice', 'action required'
        ]
        
        self.financial_keywords = [
            'bank account', 'credit card', 'ssn', 'social security',
            'password', 'pin', 'verify account', 'update payment',
            'billing information', 'wire transfer', 'send money',
            'processing fee', 'tax refund', 'claim prize'
        ]
        
        self.suspicious_phrases = [
            'click here', 'click this link', 'verify your account',
            'confirm your identity', 'unusual activity', 'suspicious activity',
            'account suspended', 'account locked', 'security alert',
            'you have won', 'congratulations', 'selected winner',
            'claim your prize', 'free gift', 'act now'
        ]
        
        self.legitimate_indicators = [
            'unsubscribe', 'privacy policy', 'terms of service',
            'official', 'customer support', 'help center'
        ]
    
    async def analyze(self, text: str) -> Dict:
        """
        Analyze text content for phishing/scam indicators
        """
        text_lower = text.lower()
        
        # Feature extraction
        features = {
            'urgency_score': self._calculate_urgency_score(text_lower),
            'financial_risk_score': self._calculate_financial_score(text_lower),
            'suspicious_phrase_count': self._count_suspicious_phrases(text_lower),
            'has_suspicious_links': self._detect_suspicious_links(text),
            'has_misspellings': self._detect_common_misspellings(text_lower),
            'excessive_punctuation': self._detect_excessive_punctuation(text),
            'all_caps_ratio': self._calculate_caps_ratio(text),
            'legitimate_indicators': self._count_legitimate_indicators(text_lower)
        }
        
        # Calculate overall scam probability
        scam_probability = self._calculate_scam_probability(features)
        
        # Identify suspicious elements
        suspicious_elements = self._identify_suspicious_elements(text, features)
        
        return {
            'scam_probability': scam_probability,
            'features': features,
            'suspicious_elements': suspicious_elements,
            'text': text
        }
    
    def _calculate_urgency_score(self, text: str) -> float:
        """Calculate urgency score based on keywords"""
        count = sum(1 for keyword in self.urgency_keywords if keyword in text)
        return min(count * 0.15, 1.0)
    
    def _calculate_financial_score(self, text: str) -> float:
        """Calculate financial risk score"""
        count = sum(1 for keyword in self.financial_keywords if keyword in text)
        return min(count * 0.2, 1.0)
    
    def _count_suspicious_phrases(self, text: str) -> int:
        """Count suspicious phrases"""
        return sum(1 for phrase in self.suspicious_phrases if phrase in text)
    
    def _detect_suspicious_links(self, text: str) -> bool:
        """Detect suspicious URL patterns"""
        suspicious_patterns = [
            r'bit\.ly', r'tinyurl', r'goo\.gl',
            r'http://[^\s]+',  # HTTP instead of HTTPS
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',  # IP addresses
        ]
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in suspicious_patterns)
    
    def _detect_common_misspellings(self, text: str) -> bool:
        """Detect common phishing misspellings"""
        misspellings = [
            'paypa1', 'amaz0n', 'g00gle', 'micros0ft',
            'app1e', 'netf1ix', 'faceb00k'
        ]
        return any(word in text for word in misspellings)
    
    def _detect_excessive_punctuation(self, text: str) -> bool:
        """Detect excessive punctuation (!!!, ???)"""
        return bool(re.search(r'[!?]{3,}', text))
    
    def _calculate_caps_ratio(self, text: str) -> float:
        """Calculate ratio of uppercase letters"""
        if not text:
            return 0.0
        letters = [c for c in text if c.isalpha()]
        if not letters:
            return 0.0
        caps = sum(1 for c in letters if c.isupper())
        return caps / len(letters)
    
    def _count_legitimate_indicators(self, text: str) -> int:
        """Count legitimate business indicators"""
        return sum(1 for indicator in self.legitimate_indicators if indicator in text)
    
    def _calculate_scam_probability(self, features: Dict) -> float:
        """
        Calculate overall scam probability using weighted features
        In production, this would be a trained ML model
        """
        score = 0.0
        
        # Weighted scoring
        score += features['urgency_score'] * 0.25
        score += features['financial_risk_score'] * 0.30
        score += min(features['suspicious_phrase_count'] * 0.1, 0.3)
        
        if features['has_suspicious_links']:
            score += 0.20
        
        if features['has_misspellings']:
            score += 0.15
        
        if features['excessive_punctuation']:
            score += 0.10
        
        if features['all_caps_ratio'] > 0.5:
            score += 0.15
        
        # Reduce score for legitimate indicators
        score -= features['legitimate_indicators'] * 0.1
        
        # Normalize to 0-1 range
        return max(0.0, min(1.0, score))
    
    def _identify_suspicious_elements(self, text: str, features: Dict) -> List[str]:
        """Identify specific suspicious elements in the text"""
        elements = []
        text_lower = text.lower()
        
        # Check for urgency
        found_urgency = [kw for kw in self.urgency_keywords if kw in text_lower]
        if found_urgency:
            elements.append(f"Urgency tactics: {', '.join(found_urgency[:3])}")
        
        # Check for financial requests
        found_financial = [kw for kw in self.financial_keywords if kw in text_lower]
        if found_financial:
            elements.append(f"Financial information request: {', '.join(found_financial[:3])}")
        
        # Check for suspicious phrases
        found_phrases = [phrase for phrase in self.suspicious_phrases if phrase in text_lower]
        if found_phrases:
            elements.append(f"Suspicious phrases: {', '.join(found_phrases[:2])}")
        
        # Check for links
        if features['has_suspicious_links']:
            elements.append("Contains suspicious or shortened URLs")
        
        # Check for misspellings
        if features['has_misspellings']:
            elements.append("Contains brand name misspellings")
        
        # Check for excessive caps
        if features['all_caps_ratio'] > 0.5:
            elements.append("Excessive use of capital letters")
        
        return elements if elements else ["No major red flags detected"]
