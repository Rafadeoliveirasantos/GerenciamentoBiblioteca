using Application.Services;
using Application.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginViewModel login)
    {
        var token = _authService.Authenticate(login);

        if (token == null)
            return Unauthorized(new { message = "Usuário ou senha inválidos" });

        return Ok(token);
    }
}
