use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Role {
    Founder,
    CoFounder,
    Manager,
    Staff,
    Viewer,
}

impl fmt::Display for Role {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Role::Founder => write!(f, "founder"),
            Role::CoFounder => write!(f, "cofounder"),
            Role::Manager => write!(f, "manager"),
            Role::Staff => write!(f, "staff"),
            Role::Viewer => write!(f, "viewer"),
        }
    }
}

impl std::str::FromStr for Role {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "founder" => Ok(Role::Founder),
            "cofounder" => Ok(Role::CoFounder),
            "manager" => Ok(Role::Manager),
            "staff" => Ok(Role::Staff),
            "viewer" => Ok(Role::Viewer),
            _ => Err(format!("Unknown role: {}", s)),
        }
    }
}