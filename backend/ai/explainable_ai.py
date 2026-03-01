from typing import Dict, List
import asyncio

class ExplainableAI:
    """
    Generate human-readable explanations for AI decisions
    Provides transparency and builds user trust
    """
    
    def __init__(self):
        pass
    
    async def generate_explanation(
        self, 
        text: str, 
        nlp_result: Dict,
        is_ocr: bool = False
    ) -> Dict:
        """
        Generate explanation for text-based scam detection
        """
        scam_prob = nlp_result['scam_probability']
        features = nlp_result['features']
        suspicious_elements = nlp_result['suspicious_elements']
        
        # Determine threat level
        threat_level = self._calculate_threat_level(scam_prob)
        
        # Generate natural language explanation
        explanation = self._generate_text_explanation(
            scam_prob, 
            features, 
            suspicious_elements,
            is_ocr
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(threat_level, features)
        
        # Highlight suspicious parts
        highlighted_text = self._highlight_suspicious_text(text, features)
        
        return {
            'scam_probability': round(scam_prob * 100, 1),
            'threat_level': threat_level,
            'confidence': self._calculate_confidence(features),
            'explanation': explanation,
            'suspicious_elements': suspicious_elements,
            'recommendations': recommendations,
            'highlighted_text': highlighted_text
        }
    
    async def generate_url_explanation(self, url: str, url_result: Dict) -> Dict:
        """
        Generate explanation for URL-based detection
        """
        scam_prob = url_result['scam_probability']
        features = url_result['features']
        suspicious_elements = url_result['suspicious_elements']
        
        threat_level = self._calculate_threat_level(scam_prob)
        
        explanation = self._generate_url_explanation(
            url,
            scam_prob,
            features,
            suspicious_elements
        )
        
        recommendations = self._generate_url_recommendations(threat_level, features)
        
        return {
            'scam_probability': round(scam_prob * 100, 1),
            'threat_level': threat_level,
            'confidence': self._calculate_confidence(features),
            'explanation': explanation,
            'suspicious_elements': suspicious_elements,
            'recommendations': recommendations
        }
    
    def _calculate_threat_level(self, scam_prob: float) -> str:
        """Categorize threat level based on probability"""
        if scam_prob >= 0.75:
            return "Critical"
        elif scam_prob >= 0.50:
            return "High"
        elif scam_prob >= 0.25:
            return "Medium"
        else:
            return "Low"
    
    def _calculate_confidence(self, features: Dict) -> float:
        """Calculate confidence score for the prediction"""
        # More features detected = higher confidence
        feature_count = sum(1 for v in features.values() if v)
        confidence = min(0.7 + (feature_count * 0.05), 0.98)
        return round(confidence, 2)
    
    def _generate_text_explanation(
        self,
        scam_prob: float,
        features: Dict,
        suspicious_elements: List[str],
        is_ocr: bool
    ) -> str:
        """Generate natural language explanation for text analysis"""
        
        if scam_prob >= 0.75:
            intro = "⚠️ This message shows strong indicators of a phishing or scam attempt. "
        elif scam_prob >= 0.50:
            intro = "⚠️ This message contains several red flags commonly associated with scams. "
        elif scam_prob >= 0.25:
            intro = "⚡ This message has some characteristics that warrant caution. "
        else:
            intro = "✅ This message appears relatively safe with minimal risk indicators. "
        
        # Build explanation based on features
        explanations = []
        
        if features.get('urgency_score', 0) > 0.2:
            explanations.append(
                "The message creates artificial urgency, pressuring you to act quickly "
                "without thinking—a classic manipulation tactic used in phishing attacks."
            )
        
        if features.get('financial_risk_score', 0) > 0.2:
            explanations.append(
                "It requests sensitive financial or personal information, which legitimate "
                "organizations rarely ask for via unsolicited messages."
            )
        
        if features.get('has_suspicious_links'):
            explanations.append(
                "Contains suspicious or shortened URLs that could redirect to malicious sites "
                "designed to steal your credentials or install malware."
            )
        
        if features.get('has_misspellings'):
            explanations.append(
                "Uses deliberate misspellings of brand names to evade filters while "
                "impersonating legitimate companies."
            )
        
        if features.get('excessive_punctuation'):
            explanations.append(
                "Excessive punctuation (!!!, ???) is often used to create panic and "
                "bypass your rational judgment."
            )
        
        if features.get('all_caps_ratio', 0) > 0.5:
            explanations.append(
                "Heavy use of capital letters is designed to grab attention and "
                "create a false sense of emergency."
            )
        
        if is_ocr:
            explanations.append(
                "This text was extracted from an image, a technique scammers use to "
                "evade text-based email filters."
            )
        
        # Combine explanations
        if explanations:
            explanation = intro + " " + " ".join(explanations)
        else:
            explanation = intro + "No significant phishing patterns were detected in this message."
        
        return explanation
    
    def _generate_url_explanation(
        self,
        url: str,
        scam_prob: float,
        features: Dict,
        suspicious_elements: List[str]
    ) -> str:
        """Generate explanation for URL analysis"""
        
        if scam_prob >= 0.75:
            intro = "⚠️ This URL exhibits multiple characteristics of a phishing or malicious site. "
        elif scam_prob >= 0.50:
            intro = "⚠️ This URL has several suspicious features that suggest it may not be trustworthy. "
        elif scam_prob >= 0.25:
            intro = "⚡ This URL shows some concerning patterns that warrant verification. "
        else:
            intro = "✅ This URL appears relatively safe based on our analysis. "
        
        explanations = []
        
        if features.get('has_ip_address'):
            explanations.append(
                "Uses an IP address instead of a proper domain name, which is highly unusual "
                "for legitimate websites and often indicates a temporary phishing site."
            )
        
        if features.get('suspicious_tld'):
            explanations.append(
                "The domain uses a suspicious top-level domain (TLD) that's commonly "
                "associated with spam and phishing campaigns."
            )
        
        if features.get('domain_typosquatting'):
            explanations.append(
                "The domain appears to impersonate a well-known brand through deliberate "
                "misspelling (typosquatting), a common phishing technique."
            )
        
        if features.get('uses_http'):
            explanations.append(
                "Uses insecure HTTP protocol instead of HTTPS, meaning any data you enter "
                "could be intercepted by attackers."
            )
        
        if features.get('excessive_subdomains'):
            explanations.append(
                "Contains an unusual number of subdomains, which attackers use to make "
                "malicious URLs appear legitimate at first glance."
            )
        
        if features.get('is_trusted_domain'):
            explanations.append(
                "However, the domain matches a known trusted website, which reduces the risk significantly."
            )
        
        if explanations:
            explanation = intro + " " + " ".join(explanations)
        else:
            explanation = intro + "No major security concerns were identified with this URL."
        
        return explanation
    
    def _generate_recommendations(self, threat_level: str, features: Dict) -> List[str]:
        """Generate actionable safety recommendations"""
        recommendations = []
        
        if threat_level == "Critical":
            recommendations.extend([
                "🚫 DO NOT click any links or download attachments",
                "🚫 DO NOT provide any personal or financial information",
                "🗑️ Delete this message immediately",
                "📧 Report as phishing to your email provider",
                "🔒 If you've already clicked, change your passwords immediately"
            ])
        elif threat_level == "High":
            recommendations.extend([
                "⚠️ Avoid clicking links or providing information",
                "🔍 Verify sender identity through official channels",
                "📧 Report as suspicious",
                "🛡️ Enable two-factor authentication on your accounts"
            ])
        elif threat_level == "Medium":
            recommendations.extend([
                "🔍 Verify the sender's identity before responding",
                "🌐 Check URLs carefully before clicking",
                "📞 Contact the organization directly using official contact info",
                "🤔 Be skeptical of urgent requests"
            ])
        else:
            recommendations.extend([
                "✅ Message appears safe, but always stay vigilant",
                "🔍 Verify sender if requesting sensitive information",
                "🛡️ Keep your security software updated"
            ])
        
        return recommendations
    
    def _generate_url_recommendations(self, threat_level: str, features: Dict) -> List[str]:
        """Generate URL-specific recommendations"""
        recommendations = []
        
        if threat_level == "Critical":
            recommendations.extend([
                "🚫 DO NOT visit this website",
                "🚫 DO NOT enter any credentials or personal information",
                "🗑️ Close the browser tab immediately",
                "🔒 Run a security scan if you've already visited",
                "📧 Report the URL to your security team or IT department"
            ])
        elif threat_level == "High":
            recommendations.extend([
                "⚠️ Avoid visiting this URL",
                "🔍 Verify the website through official sources",
                "🌐 Look for HTTPS and valid security certificates",
                "📞 Contact the company directly if claiming to be them"
            ])
        elif threat_level == "Medium":
            recommendations.extend([
                "🔍 Proceed with caution",
                "🌐 Verify the URL matches the official website",
                "🔒 Check for HTTPS before entering any information",
                "🤔 Be wary of login or payment requests"
            ])
        else:
            recommendations.extend([
                "✅ URL appears safe based on our analysis",
                "🔍 Still verify HTTPS connection before entering sensitive data",
                "🛡️ Keep your browser and security software updated"
            ])
        
        return recommendations
    
    def _highlight_suspicious_text(self, text: str, features: Dict) -> str:
        """
        Return text with suspicious parts marked
        In production, this would return structured data for frontend highlighting
        """
        # For now, return original text
        # Frontend will handle highlighting based on suspicious_elements
        return text
