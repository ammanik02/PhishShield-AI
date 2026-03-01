import re
from typing import Dict, List
from urllib.parse import urlparse
import asyncio

class URLDetector:
    """
    URL-based phishing detection using feature extraction
    and reputation analysis
    """
    
    def __init__(self):
        self.suspicious_tlds = [
            '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top',
            '.work', '.click', '.link', '.download'
        ]
        
        self.trusted_domains = [
            'google.com', 'microsoft.com', 'apple.com', 'amazon.com',
            'github.com', 'stackoverflow.com', 'linkedin.com'
        ]
        
        self.brand_keywords = [
            'paypal', 'amazon', 'microsoft', 'apple', 'google',
            'facebook', 'netflix', 'bank', 'secure', 'login',
            'verify', 'account', 'update'
        ]
    
    async def analyze(self, url: str) -> Dict:
        """
        Analyze URL for phishing indicators
        """
        parsed = urlparse(url)
        
        features = {
            'has_ip_address': self._has_ip_address(parsed.netloc),
            'suspicious_tld': self._check_suspicious_tld(parsed.netloc),
            'has_suspicious_keywords': self._has_suspicious_keywords(url),
            'excessive_subdomains': self._check_excessive_subdomains(parsed.netloc),
            'uses_http': parsed.scheme == 'http',
            'has_suspicious_port': self._has_suspicious_port(parsed.netloc),
            'url_length': len(url),
            'has_at_symbol': '@' in url,
            'has_double_slash': '//' in parsed.path,
            'domain_typosquatting': self._check_typosquatting(parsed.netloc),
            'is_trusted_domain': self._is_trusted_domain(parsed.netloc)
        }
        
        # Calculate scam probability
        scam_probability = self._calculate_url_risk(features)
        
        # Identify suspicious elements
        suspicious_elements = self._identify_url_issues(url, features)
        
        return {
            'scam_probability': scam_probability,
            'features': features,
            'suspicious_elements': suspicious_elements,
            'url': url,
            'domain': parsed.netloc
        }
    
    def _has_ip_address(self, netloc: str) -> bool:
        """Check if URL uses IP address instead of domain"""
        ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
        return bool(re.match(ip_pattern, netloc))
    
    def _check_suspicious_tld(self, netloc: str) -> bool:
        """Check for suspicious top-level domains"""
        return any(netloc.endswith(tld) for tld in self.suspicious_tlds)
    
    def _has_suspicious_keywords(self, url: str) -> bool:
        """Check for brand impersonation keywords"""
        url_lower = url.lower()
        return any(keyword in url_lower for keyword in self.brand_keywords)
    
    def _check_excessive_subdomains(self, netloc: str) -> bool:
        """Check for excessive subdomains (e.g., secure.login.paypal.fake.com)"""
        parts = netloc.split('.')
        return len(parts) > 4
    
    def _has_suspicious_port(self, netloc: str) -> bool:
        """Check for non-standard ports"""
        if ':' in netloc:
            try:
                port = int(netloc.split(':')[1])
                return port not in [80, 443, 8080]
            except:
                return False
        return False
    
    def _check_typosquatting(self, netloc: str) -> bool:
        """Check for common typosquatting patterns"""
        typosquatting_patterns = [
            'paypa1', 'amaz0n', 'g00gle', 'micros0ft',
            'app1e', 'netf1ix', 'faceb00k', 'tw1tter'
        ]
        netloc_lower = netloc.lower()
        return any(pattern in netloc_lower for pattern in typosquatting_patterns)
    
    def _is_trusted_domain(self, netloc: str) -> bool:
        """Check if domain is in trusted list"""
        return any(trusted in netloc.lower() for trusted in self.trusted_domains)
    
    def _calculate_url_risk(self, features: Dict) -> float:
        """Calculate overall URL risk score"""
        score = 0.0
        
        # High-risk indicators
        if features['has_ip_address']:
            score += 0.35
        
        if features['suspicious_tld']:
            score += 0.25
        
        if features['domain_typosquatting']:
            score += 0.30
        
        # Medium-risk indicators
        if features['uses_http']:
            score += 0.15
        
        if features['excessive_subdomains']:
            score += 0.20
        
        if features['has_suspicious_keywords']:
            score += 0.15
        
        # Low-risk indicators
        if features['has_at_symbol']:
            score += 0.10
        
        if features['has_suspicious_port']:
            score += 0.10
        
        if features['url_length'] > 100:
            score += 0.10
        
        # Reduce score for trusted domains
        if features['is_trusted_domain']:
            score = max(0.0, score - 0.5)
        
        return max(0.0, min(1.0, score))
    
    def _identify_url_issues(self, url: str, features: Dict) -> List[str]:
        """Identify specific issues with the URL"""
        issues = []
        
        if features['has_ip_address']:
            issues.append("Uses IP address instead of domain name")
        
        if features['suspicious_tld']:
            issues.append("Suspicious top-level domain (TLD)")
        
        if features['domain_typosquatting']:
            issues.append("Possible brand impersonation/typosquatting")
        
        if features['uses_http']:
            issues.append("Uses insecure HTTP protocol")
        
        if features['excessive_subdomains']:
            issues.append("Excessive subdomains detected")
        
        if features['has_suspicious_keywords']:
            issues.append("Contains brand or security-related keywords")
        
        if features['url_length'] > 100:
            issues.append("Unusually long URL")
        
        if features['is_trusted_domain']:
            issues.append("Domain appears to be legitimate")
        
        return issues if issues else ["No major red flags detected"]
