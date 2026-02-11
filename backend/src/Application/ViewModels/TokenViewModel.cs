namespace Application.ViewModels;

public class TokenViewModel
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
